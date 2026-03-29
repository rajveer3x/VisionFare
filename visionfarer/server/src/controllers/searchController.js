const axios = require('axios');
const { searchSchema } = require('../validation/searchSchema');
const { ValidationError, ExternalServiceError, NotFoundError } = require('../utils/customErrors');
const { rapidApiClient } = require('../services/travelApiClient');
const { getCached, setCache, buildSearchCacheKey } = require('../services/cacheService');
const {
  normalizeBusResults,
  normalizeTrainResults,
  normalizeFlightResults,
  sortByPriceAscending,
  sliceTopN
} = require('../adapters/travelDataAdapter');
const Route = require('../models/Route');
const PriceSnapshot = require('../models/PriceSnapshot');
const logger = require('../utils/logger');

const searchRoutes = async (req, res, next) => {
  try {
    // STEP 1 — Validate input
    const { error, value } = searchSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const { origin, destination, travelDate, transportType } = value;

    // STEP 2 — Check cache
    const cacheKey = buildSearchCacheKey(origin, destination, travelDate, transportType);
    const cachedData = await getCached(cacheKey);
    
    if (cachedData) {
      return res.status(200).json({ 
        success: true, 
        source: 'cache', 
        ...cachedData 
      });
    }

    // STEP 3 — Fetch from external API
    let rawApiResponse;
    try {
      let endpoint = '/buses';
      if (transportType === 'train') endpoint = '/trains';
      if (transportType === 'flight') endpoint = '/flights';

      const response = await rapidApiClient.get(endpoint, {
        params: { origin, destination, date: travelDate }
      });
      rawApiResponse = response.data;
    } catch (err) {
      throw new ExternalServiceError("Unable to fetch live prices. Please try again.");
    }

    // STEP 4 — Normalize data
    let normalizedResults = [];
    if (transportType === 'bus') {
      normalizedResults = normalizeBusResults(rawApiResponse, origin, destination);
    } else if (transportType === 'train') {
      normalizedResults = normalizeTrainResults(rawApiResponse, origin, destination);
    } else if (transportType === 'flight') {
      normalizedResults = normalizeFlightResults(rawApiResponse, origin, destination);
    }

    if (normalizedResults.length === 0) {
      throw new NotFoundError("No routes found for this search.");
    }

    // STEP 5 — Sort & split
    const sortedResults = sortByPriceAscending(normalizedResults);
    let { topRoutes, remaining } = sliceTopN(sortedResults, 5);

    // STEP 6 — Request AI predictions
    try {
      if (!process.env.AI_SERVICE_URL) {
        throw new Error("AI_SERVICE_URL not configured.");
      }
      
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/predict`, 
        { routes: topRoutes },
        { timeout: 5000 }
      );
      
      const aiPredictions = aiResponse.data?.predictions || [];

      // Merge prediction data back into topRoutes by matching on externalId
      topRoutes = topRoutes.map(route => {
        const prediction = aiPredictions.find(p => p.externalId === route.externalId);
        if (prediction) {
          return {
            ...route,
            aiRecommendation: prediction.aiRecommendation || 'PENDING',
            aiConfidence: prediction.aiConfidence || null
          };
        }
        return route;
      });

    } catch (err) {
      logger.warn(`[AI SERVICE] Unavailable — returning results without predictions. Reason: ${err.message}`);
      topRoutes = topRoutes.map(route => ({
        ...route,
        aiRecommendation: 'PENDING'
      }));
    }

    const fetchedAt = new Date();

    const responsePayload = {
      count: sortedResults.length,
      fetchedAt,
      topResults: topRoutes,
      otherResults: remaining
    };

    // STEP 7 — Save to MongoDB (Background)
    (async () => {
        try {
          // Verify user auth exists if you strictly tied routes to users - assuming it's optional per Route schema 
          // createdBy is optional in Route.js schema `type: mongoose.Schema.Types.ObjectId`
          const routeDoc = await Route.create({
            origin,
            destination,
            travelDate,
            transportType,
            createdBy: req.user ? req.user._id : undefined
          });

          // Insert snapshots for all returned properties
          const allRoutes = [...topRoutes, ...remaining];
          const snapshotsToInsert = allRoutes.map(route => ({
            routeId: routeDoc._id,
            operatorName: route.operatorName,
            price: route.price,
            currency: route.currency,
            departureTime: route.departureTime,
            arrivalTime: route.arrivalTime,
            duration: route.duration,
            availableSeats: route.availableSeats,
            aiRecommendation: route.aiRecommendation,
            aiConfidence: route.aiConfidence,
            fetchedAt: fetchedAt
          }));

          if (snapshotsToInsert.length > 0) {
            await PriceSnapshot.insertMany(snapshotsToInsert);
          }
        } catch (dbErr) {
          logger.error(`[DB SAVE ERROR] Failed to perform background save: ${dbErr.message}`);
        }
    })(); // Immediately invokes Promise, does not await

    // STEP 8 — Cache the result
    await setCache(cacheKey, responsePayload, 900); // 15 minutes TTL

    // STEP 9 — Respond
    return res.status(200).json({
      success: true,
      source: 'live',
      ...responsePayload
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { searchRoutes };

/**
 * @typedef {Object} NormalizedRoute
 * @property {string} externalId      - Unique ID from the external API
 * @property {string} operatorName    - e.g., "RSRTC Volvo"
 * @property {string} transportType   - 'bus' | 'train' | 'flight'
 * @property {number} price           - In INR (number, never string)
 * @property {string} currency        - Always 'INR'
 * @property {string} origin          - e.g., "Rishikesh"
 * @property {string} destination     - e.g., "Delhi"
 * @property {string|null} departureTime - ISO 8601 string or null
 * @property {string|null} arrivalTime   - ISO 8601 string or null
 * @property {string} duration        - Human readable, e.g., "6h 30m"
 * @property {number|null} availableSeats
 * @property {string} aiRecommendation - Default: 'PENDING'
 * @property {number|null} aiConfidence - Default: null
 */

// TODO: Make currency conversion dynamic in a future phase
const USD_TO_INR = 83.5;
const EUR_TO_INR = 90.2;

/**
 * Parses a string or numeric price into a valid number.
 * e.g., "₹450" -> 450, "450 INR" -> 450
 * @param {string|number} rawPrice 
 * @returns {number}
 */
const parsePrice = (rawPrice) => {
  if (typeof rawPrice === 'number') return rawPrice;
  if (!rawPrice) return NaN;
  // Strip out anything that isn't a digit or decimal point
  const numericString = rawPrice.toString().replace(/[^\d.-]/g, '');
  return parseFloat(numericString);
};

/*
Mock JSON structure for Bus:
{
  "status": "success",
  "data": {
    "busSchedules": [
      {
        "routeId": "b-84729",
        "travelsName": "Zingbus",
        "busType": "A/C Sleeper (2+1)",
        "fare": {
          "baseFare": 650,
          "currency": "INR"
        },
        "departureTime": "2026-04-15T22:30:00+05:30",
        "arrivalTime": "2026-04-16T05:00:00+05:30",
        "duration": "6h 30m",
        "seatsAvailable": 12
      }
    ]
  }
}
*/
const normalizeBusResults = (rawApiResponse, origin, destination) => {
  const schedules = rawApiResponse?.data?.busSchedules || [];
  
  return schedules
    .map(bus => {
      let price = NaN;
      if (bus.fare && bus.fare.baseFare !== undefined) {
        price = parsePrice(bus.fare.baseFare);
      } else if (bus.price !== undefined) {
        price = parsePrice(bus.price); // Fallback
      }

      return {
        externalId: bus.routeId || `bus-${Date.now()}-${Math.random()}`,
        operatorName: bus.travelsName || 'Unknown Operator',
        transportType: 'bus',
        price: price,
        currency: 'INR',
        origin: origin,
        destination: destination,
        departureTime: bus.departureTime || null,
        arrivalTime: bus.arrivalTime || null,
        duration: bus.duration || 'Unknown',
        availableSeats: bus.seatsAvailable !== undefined ? parseInt(bus.seatsAvailable, 10) : null,
        aiRecommendation: 'PENDING',
        aiConfidence: null
      };
    })
    .filter(route => !isNaN(route.price) && route.price > 0);
};

/*
Mock JSON structure for Train:
{
  "status": "success",
  "data": {
    "trainSchedules": [
      {
        "trainId": "12004",
        "trainName": "Shatabdi Express",
        "ticketPrice": "₹1200",
        "departAt": "2026-04-15T06:00:00+05:30",
        "arriveAt": "2026-04-15T12:30:00+05:30",
        "travelTime": "6h 30m",
        "seatCount": 45
      }
    ]
  }
}
*/
const normalizeTrainResults = (rawApiResponse, origin, destination) => {
  const schedules = rawApiResponse?.data?.trainSchedules || [];
  
  return schedules
    .map(train => {
      const price = parsePrice(train.ticketPrice);

      return {
        externalId: train.trainId || `train-${Date.now()}-${Math.random()}`,
        operatorName: train.trainName || 'Indian Railways',
        transportType: 'train',
        price: price,
        currency: 'INR',
        origin: origin,
        destination: destination,
        departureTime: train.departAt || null,
        arrivalTime: train.arriveAt || null,
        duration: train.travelTime || 'Unknown',
        availableSeats: train.seatCount !== undefined ? parseInt(train.seatCount, 10) : null,
        aiRecommendation: 'PENDING',
        aiConfidence: null
      };
    })
    .filter(route => !isNaN(route.price) && route.price > 0);
};

/*
Mock JSON structure for Flight:
{
  "status": "success",
  "data": {
    "flightSchedules": [
      {
        "flightNumber": "AI-101",
        "airlineName": "Air India",
        "cost": {
          "amount": 120,
          "currency": "USD"
        },
        "departureTime": "2026-04-15T10:00:00Z",
        "arrivalTime": "2026-04-15T14:30:00Z",
        "flightDuration": "4h 30m",
        "availableSeats": 5
      }
    ]
  }
}
*/
const normalizeFlightResults = (rawApiResponse, origin, destination) => {
  const schedules = rawApiResponse?.data?.flightSchedules || [];
  
  return schedules
    .map(flight => {
      let price = NaN;
      let currency = 'INR';

      if (flight.cost) {
        price = parsePrice(flight.cost.amount);
        currency = (flight.cost.currency || 'INR').toUpperCase();
      }

      // Currency conversation
      if (currency === 'USD') {
        price = price * USD_TO_INR;
      } else if (currency === 'EUR') {
        price = price * EUR_TO_INR;
      }

      return {
        externalId: flight.flightNumber || `flight-${Date.now()}-${Math.random()}`,
        operatorName: flight.airlineName || 'Unknown Airline',
        transportType: 'flight',
        price: Math.round(price), // ensure clean INR values
        currency: 'INR',
        origin: origin,
        destination: destination,
        departureTime: flight.departureTime || null,
        arrivalTime: flight.arrivalTime || null,
        duration: flight.flightDuration || 'Unknown',
        availableSeats: flight.availableSeats !== undefined ? parseInt(flight.availableSeats, 10) : null,
        aiRecommendation: 'PENDING',
        aiConfidence: null
      };
    })
    .filter(route => !isNaN(route.price) && route.price > 0);
};

/**
 * Sorts an array of NormalizedRoute by price in ascending order.
 * Returns a new array, does not mutate input.
 * 
 * @param {Array<NormalizedRoute>} routes 
 * @returns {Array<NormalizedRoute>}
 */
const sortByPriceAscending = (routes) => {
  return [...routes].sort((a, b) => a.price - b.price);
};

/**
 * Splits the routes array at index n.
 * 
 * @param {Array<NormalizedRoute>} routes 
 * @param {number} n 
 * @returns {{ topRoutes: Array<NormalizedRoute>, remaining: Array<NormalizedRoute> }}
 */
const sliceTopN = (routes, n = 5) => {
  return {
    topRoutes: routes.slice(0, n),
    remaining: routes.slice(n)
  };
};

module.exports = {
  normalizeBusResults,
  normalizeTrainResults,
  normalizeFlightResults,
  sortByPriceAscending,
  sliceTopN
};

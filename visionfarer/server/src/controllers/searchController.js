const { searchSchema } = require('../validation/searchSchema');

const searchRoutes = async (req, res, next) => {
  try {
    const { error, value } = searchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { origin, destination, travelDate, transportType } = value;

    // Hardcoded mock response with exactly 8 fake results
    const rawResults = [
      { id: '101', operatorName: 'RSRTC Express', price: 450, departureTime: '06:00 AM', arrivalTime: '12:00 PM', duration: '6h 00m', availableSeats: 32 },
      { id: '102', operatorName: 'IntrCity SmartBus', price: 950, departureTime: '08:00 AM', arrivalTime: '01:30 PM', duration: '5h 30m', availableSeats: 15 },
      { id: '103', operatorName: 'Zingbus AC Sleeper', price: 1200, departureTime: '10:00 PM', arrivalTime: '04:00 AM', duration: '6h 00m', availableSeats: 8 },
      { id: '104', operatorName: 'VRL Travels', price: 600, departureTime: '09:00 AM', arrivalTime: '04:00 PM', duration: '7h 00m', availableSeats: 45 },
      { id: '105', operatorName: 'NueGo Electric', price: 800, departureTime: '11:00 AM', arrivalTime: '04:30 PM', duration: '5h 30m', availableSeats: 22 },
      { id: '106', operatorName: 'RedBus Premium', price: 1500, departureTime: '07:30 PM', arrivalTime: '01:00 AM', duration: '5h 30m', availableSeats: 10 },
      { id: '107', operatorName: 'Mahalaxmi Travels', price: 350, departureTime: '02:00 PM', arrivalTime: '09:00 PM', duration: '7h 00m', availableSeats: 18 },
      { id: '108', operatorName: 'Gangester Travels Volvo', price: 1750, departureTime: '11:00 PM', arrivalTime: '04:30 AM', duration: '5h 30m', availableSeats: 5 }
    ];

    // Sort all 8 results by price ascending
    rawResults.sort((a, b) => a.price - b.price);

    // The top 5 cheapest: set aiRecommendation to "PENDING" and aiConfidence to null.
    // Results 6-8: set aiRecommendation to "NOT_ANALYZED".
    const processedResults = rawResults.map((trip, index) => {
      if (index < 5) {
        return {
          ...trip,
          aiRecommendation: 'PENDING',
          aiConfidence: null
        };
      } else {
        return {
          ...trip,
          aiRecommendation: 'NOT_ANALYZED'
        };
      }
    });

    const topResults = processedResults.slice(0, 5);
    const otherResults = processedResults.slice(5);

    return res.status(200).json({
      success: true,
      count: processedResults.length,
      topResults,
      otherResults
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { searchRoutes };

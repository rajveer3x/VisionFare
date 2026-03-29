const Joi = require('joi');

const searchSchema = Joi.object({
  origin: Joi.string().min(2).max(100).required(),
  destination: Joi.string().min(2).max(100).required(),
  // Validate it's an ISO date and reset the local 'now' to the start of the current day to allow any time today.
  travelDate: Joi.date().iso().min(new Date(new Date().setHours(0, 0, 0, 0))).required()
    .messages({
      'date.min': 'travelDate must be today or a future date'
    }),
  transportType: Joi.string().valid('flight', 'bus', 'train').required()
});

module.exports = {
  searchSchema
};

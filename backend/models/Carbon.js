const mongoose = require('mongoose');

const carbonDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalFootprint: {
    type: Number,
    required: true
  },
  categories: {
    transport: Number,
    energy: Number,
    food: Number,
    consumption: Number
  },
  recommendations: [String],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CarbonData', carbonDataSchema);
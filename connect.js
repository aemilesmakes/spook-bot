// Connect to MongoDB
const { MongoClient } = require('mongodb');
const { MONGO_URI } = require('./config.json');

module.exports.client = new MongoClient(MONGO_URI);
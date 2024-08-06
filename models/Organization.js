const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('organization', OrganizationSchema);

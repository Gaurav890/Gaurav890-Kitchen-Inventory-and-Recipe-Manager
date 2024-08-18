const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });

  
  module.exports = { InventoryItem: mongoose.model('InventoryItem', InventoryItemSchema) };
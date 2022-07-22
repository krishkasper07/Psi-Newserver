const mongoose = require("mongoose");

const abandonedSchema = mongoose.Schema({
  abandoned_checkout_url: {
    type: String,
  },
  customerName: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zip: {
    type: String,
  },
  phone: {
    type: String,
  },
  lastOrderPricing: {
    type: String
  },
  notes: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("abandoned", abandonedSchema);

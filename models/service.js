

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;

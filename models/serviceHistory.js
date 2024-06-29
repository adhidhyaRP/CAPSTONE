import mongoose from 'mongoose';

const serviceHistorySchema = new mongoose.Schema({
  user: { type: String, required: true },
  vehicle: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  details: { type: String, required: true },
  cost: { type: Number, required: true }
});

const ServiceHistory = mongoose.model('ServiceHistory', serviceHistorySchema);
export default ServiceHistory;

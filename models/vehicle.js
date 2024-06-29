import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;

import mongoose from 'mongoose';

const vehicleExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true }
});

const VehicleExpense = mongoose.model('VehicleExpense', vehicleExpenseSchema);
export default VehicleExpense;

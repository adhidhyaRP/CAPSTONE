import express from 'express';
import VehicleExpense from '../models/vehicleExpense.js';

const router = express.Router();

 
router.get('/:vehicleId', async (req, res) => {
  try {
    const expenses = await VehicleExpense.find({ vehicle: req.params.vehicleId, user: req.user._id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 
router.post('/', async (req, res) => {
  const { vehicle, date, amount, description } = req.body;

  try {
    const newExpense = new VehicleExpense({
      user: req.user._id,  
      vehicle,
      date,
      amount,
      description
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

import express from 'express';
import Vehicle from '../models/vehicle.js';

const router = express.Router();

 
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
router.post('/', async (req, res) => {
  const { user, make, model, year, vin } = req.body;

  try {
    const newVehicle = new Vehicle({ user, make, model, year, vin });
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
 
router.get('/user/:userId', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.params.userId });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

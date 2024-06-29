import express from 'express';
import ServiceHistory from '../models/serviceHistory.js';
import mongoose from 'mongoose';


const router = express.Router();


router.get('/all/serviceHistory', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const serviceHistory = await ServiceHistory.find({ user: userId }).populate('vehicle').populate('service');
    res.json(serviceHistory);
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








router.get('/:vehicleId/serviceHistory', async (req, res) => {
  const { vehicleId } = req.params;
  const userId = req.query.userId;
 

  try {
   
   
    let query = { vehicle: vehicleId, user: userId };
    

    const history = await ServiceHistory.find(query);

   
    
    res.json(history);
  } catch (err) {
    console.error('Error fetching service history:', err.message);
    res.status(500).json({ message: err.message });
  }
});








router.post('/', async (req, res) => {
  const {user, vehicle, service, date, details, cost } = req.body;
  try {
    console.log(user, vehicle, service, date, details, cost)
    const newServiceHistory = new ServiceHistory({ user,vehicle, service, date, details, cost });
    const savedEntry = await newServiceHistory.save();
    console.log('saved===========',savedEntry)
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
 
router.get('/total-cost', async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: 'User ID, start date, and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);  

    const serviceHistory = await ServiceHistory.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });

    const totalCost = serviceHistory.reduce((acc, record) => acc + record.cost, 0);

    res.json({ totalCost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

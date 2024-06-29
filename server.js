 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import vehiclesRouter from './routes/vehicles.js';
import serviceHistoryRouter from './routes/serviceHistory.js';
import authRouter from './routes/auth.js';
import { serviceRouter } from './routes/services.js';
import vehicleExpensesRouter from './routes/vehicleExpenses.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Routes
app.use('/auth', authRouter);
app.use('/services', serviceRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/serviceHistory', serviceHistoryRouter);
app.use('/vehicleExpenses', vehicleExpensesRouter);



app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,  
    currency: currency,
    receipt: 'receipt_order_74394'  
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
});

app.post('/capture-payment', async (req, res) => {
  const { paymentId, paymentAmount } = req.body;

  try {
    const response = await razorpay.payments.capture(paymentId, paymentAmount * 100);
    res.json(response);
  } catch (error) {
    console.error('Failed to capture payment:', error);
    res.status(500).json({ message: 'Failed to capture payment' });
  }
});

 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3000;

 
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export { app, transporter };

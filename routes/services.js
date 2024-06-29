 
import express from 'express';
import Booking from '../models/booking.js';
import Service from '../models/service.js';
import Review from '../models/review.js';
import { transporter } from '../server.js'; 

const serviceRouter = express.Router();

 
serviceRouter.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('reviews');
    res.send(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 
serviceRouter.post('/bookings', async (req, res) => {
  const { name, email, phone, date, time, serviceId, paymentId } = req.body;

  try {
    
    const newBooking = new Booking({
      name,
      email,
      phone,
      date,
      time,
      service: serviceId,
      paymentId
    });

     
    const savedBooking = await newBooking.save();

     
    await sendBookingConfirmationEmail(savedBooking);

    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

 
const sendBookingConfirmationEmail = async (booking) => {
  try {
    const { name, email, date, time } = booking;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      html: `
        <p>Hello ${name},</p>
        <p>Your booking for ${date.toDateString()} at ${time} has been confirmed.</p>
        <p>Thank you for choosing our service.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};

 
serviceRouter.post('/:serviceId/reviews', async (req, res) => {
  const { serviceId } = req.params;
  const { rating, comment } = req.body;

  try {
    const newReview = new Review({
      rating,
      comment,
      service: serviceId
    });

    const savedReview = await newReview.save();
    await Service.findByIdAndUpdate(serviceId, { $push: { reviews: savedReview._id } });

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: error.message });
  }
});
 
serviceRouter.get('/:serviceId/reviews', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ service: serviceId });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

export { serviceRouter };

import cron from 'node-cron';
import Booking from './models/booking.js';
import { transporter } from './server.js';

 
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const threeHoursLaterStart = new Date(now.getTime() + 3 * 60 * 60 * 1000); 
    const threeHoursLaterEnd = new Date(threeHoursLaterStart.getTime() + 60 * 1000); 

     
    const bookings = await Booking.find({
      date: { $gte: threeHoursLaterStart, $lt: threeHoursLaterEnd },
      reminderSent: false
    });

    for (const booking of bookings) {
      await sendReminderEmail(booking);
      booking.reminderSent = true;
      booking.reminderSentAt = new Date();
      await booking.save();
    }
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
});

 
const sendReminderEmail = async (booking) => {
  try {
    const { name, email, date, time } = booking;
    const service = booking.service;  

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reminder: Upcoming Service Appointment',
      html: `
        <p>Hello ${name},</p>
        <p>This is a reminder for your upcoming service appointment on ${date.toDateString()} at ${time}.</p>
        <p>Please be prepared and arrive on time. Thank you!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const prisma = new PrismaClient();
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReminders() {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: now, lte: in24Hours },
        status: 'SCHEDULED',
        reminderSent: false,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    for (const appt of appointments) {
      const email = {
        from: process.env.EMAIL_USER,
        to: appt.patient.user.email,
        subject: 'Appointment Reminder',
        text: `Dear ${appt.patient.user.name},\n\nThis is a reminder for your appointment with ${appt.doctor.user.name} on ${new Date(appt.date).toLocaleString()}.\nReason: ${appt.reason}\n\nThank you,\nHospital Management System`,
      };

      await transporter.sendMail(email);

      if (appt.patient.phone) {
        await twilioClient.messages.create({
          body: `Reminder: Your appointment with ${appt.doctor.user.name} is on ${new Date(appt.date).toLocaleString()}. Reason: ${appt.reason}`,
          from: process.env.TWILIO_PHONE,
          to: appt.patient.phone,
        });
      }

      await prisma.appointment.update({
        where: { id: appt.id },
        data: { reminderSent: true },
      });
    }

    console.log('Reminders sent successfully');
  } catch (error) {
    console.error('Error sending reminders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

sendReminders();

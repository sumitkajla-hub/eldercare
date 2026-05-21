// Booking Model - Manages care service bookings
// Tracks status workflow: pending -> accepted -> in-progress -> completed
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caregiver',
      required: [true, 'Caregiver ID is required'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
    bookingType: {
      type: String,
      enum: {
        values: ['hourly', 'daily', 'long-term'],
        message: 'Booking type must be hourly, daily, or long-term',
      },
      required: [true, 'Booking type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    scheduledTime: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
        message: 'Status must be pending, accepted, in-progress, completed, or cancelled',
      },
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development (hot reload)
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;

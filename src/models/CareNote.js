// CareNote Model - Daily care notes and vitals tracking
// Created by caregivers during active bookings
import mongoose from 'mongoose';

const CareNoteSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required'],
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: [true, 'Caregiver ID is required'],
  },
  note: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
  },
  vitals: {
    bp: {
      type: String,
      default: '',
    },
    temperature: {
      type: String,
      default: '',
    },
    pulse: {
      type: String,
      default: '',
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development (hot reload)
const CareNote = mongoose.models.CareNote || mongoose.model('CareNote', CareNoteSchema);

export default CareNote;

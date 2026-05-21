// Caregiver Model - Professional caregiver profile and details
// Linked to User model, includes verification status and ratings
import mongoose from 'mongoose';

const CaregiverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
  },
  specialization: {
    type: String,
    enum: {
      values: ['nursing', 'attendant', 'physiotherapy', 'post-hospital'],
      message: 'Specialization must be nursing, attendant, physiotherapy, or post-hospital',
    },
    required: [true, 'Specialization is required'],
  },
  qualifications: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative'],
  },
  hourlyRate: {
    type: Number,
    default: 0,
    min: [0, 'Rate cannot be negative'],
  },
  dailyRate: {
    type: Number,
    default: 0,
    min: [0, 'Rate cannot be negative'],
  },
  monthlyRate: {
    type: Number,
    default: 0,
    min: [0, 'Rate cannot be negative'],
  },
  serviceAreas: {
    type: [String],
    default: [],
  },
  languages: {
    type: [String],
    default: [],
  },
  availability: {
    days: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    hours: {
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '18:00',
      },
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocs: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development (hot reload)
const Caregiver = mongoose.models.Caregiver || mongoose.model('Caregiver', CaregiverSchema);

export default Caregiver;

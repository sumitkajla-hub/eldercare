// Patient Model - Stores patient/elderly person details
// Linked to the user who registered them
import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Please enter a valid age'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other',
    },
    required: [true, 'Gender is required'],
  },
  medicalConditions: {
    type: [String],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    relation: {
      type: String,
      trim: true,
    },
  },
  specialNotes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development (hot reload)
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

export default Patient;

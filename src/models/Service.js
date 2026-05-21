// Service Model - Defines available healthcare services
// Categories align with caregiver specializations
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ['nursing', 'attendant', 'physiotherapy', 'post-hospital'],
      message: 'Category must be nursing, attendant, physiotherapy, or post-hospital',
    },
    required: [true, 'Category is required'],
  },
  icon: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative'],
  },
  requiredQualification: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development (hot reload)
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

export default Service;

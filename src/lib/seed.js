import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Caregiver from '@/models/Caregiver';
import Service from '@/models/Service';
import Patient from '@/models/Patient';
import Booking from '@/models/Booking';

export async function seedDatabase() {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Caregiver.deleteMany({});
  await Service.deleteMany({});
  await Patient.deleteMany({});
  await Booking.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@eldercare.com',
    password: 'admin123',
    phone: '9999999999',
    role: 'admin',
    city: 'Mumbai',
  });

  // Create sample users
  const user1 = await User.create({
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'user123',
    phone: '9876543210',
    role: 'user',
    city: 'Mumbai',
    address: '123 Marine Drive, Mumbai',
  });

  const user2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'user123',
    phone: '9876543211',
    role: 'user',
    city: 'Delhi',
    address: '456 Connaught Place, Delhi',
  });

  // Create caregiver users
  const cgUsers = [];
  const caregiverData = [
    { name: 'Dr. Anita Desai', email: 'anita@example.com', phone: '9001001001', city: 'Mumbai', spec: 'nursing', exp: 12, hourly: 800, daily: 5000, monthly: 120000, qual: ['BSc Nursing', 'ICU Certified'], bio: 'Experienced critical care nurse with 12 years of expertise in elderly care and post-surgical recovery.', langs: ['Hindi', 'English', 'Marathi'] },
    { name: 'Suresh Patil', email: 'suresh@example.com', phone: '9001001002', city: 'Mumbai', spec: 'attendant', exp: 8, hourly: 400, daily: 2500, monthly: 60000, qual: ['Certified Caregiver', 'First Aid'], bio: 'Compassionate attendant specializing in daily care and mobility assistance for senior citizens.', langs: ['Hindi', 'English', 'Marathi'] },
    { name: 'Dr. Meera Iyer', email: 'meera@example.com', phone: '9001001003', city: 'Bangalore', spec: 'physiotherapy', exp: 10, hourly: 1000, daily: 6000, monthly: 150000, qual: ['BPT', 'MPT Geriatrics'], bio: 'Specialized physiotherapist focused on geriatric rehabilitation and mobility improvement.', langs: ['Hindi', 'English', 'Tamil', 'Kannada'] },
    { name: 'Rahul Verma', email: 'rahul@example.com', phone: '9001001004', city: 'Delhi', spec: 'post-hospital', exp: 6, hourly: 600, daily: 4000, monthly: 100000, qual: ['GNM Nursing', 'Wound Care Certified'], bio: 'Expert in post-hospital recovery care including wound management and medication administration.', langs: ['Hindi', 'English'] },
    { name: 'Fatima Khan', email: 'fatima@example.com', phone: '9001001005', city: 'Mumbai', spec: 'nursing', exp: 15, hourly: 900, daily: 5500, monthly: 135000, qual: ['MSc Nursing', 'Palliative Care'], bio: 'Senior nurse with specialized training in palliative care and chronic disease management.', langs: ['Hindi', 'English', 'Urdu'] },
    { name: 'Amit Joshi', email: 'amit@example.com', phone: '9001001006', city: 'Pune', spec: 'attendant', exp: 5, hourly: 350, daily: 2200, monthly: 55000, qual: ['Certified Caregiver', 'CPR Certified'], bio: 'Dedicated caregiver providing personal care, companionship, and daily assistance for elderly patients.', langs: ['Hindi', 'English', 'Marathi'] },
  ];

  for (const cg of caregiverData) {
    const u = await User.create({
      name: cg.name,
      email: cg.email,
      password: 'caregiver123',
      phone: cg.phone,
      role: 'caregiver',
      city: cg.city,
    });
    cgUsers.push(u);

    await Caregiver.create({
      userId: u._id,
      specialization: cg.spec,
      qualifications: cg.qual,
      experience: cg.exp,
      hourlyRate: cg.hourly,
      dailyRate: cg.daily,
      monthlyRate: cg.monthly,
      serviceAreas: [cg.city, 'Nearby Areas'],
      languages: cg.langs,
      availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], hours: { start: '08:00', end: '20:00' } },
      isVerified: true,
      rating: (4 + Math.random()).toFixed(1),
      totalReviews: Math.floor(Math.random() * 50) + 10,
      totalBookings: Math.floor(Math.random() * 100) + 20,
      bio: cg.bio,
    });
  }

  // Create services
  const services = await Service.insertMany([
    { name: 'Nursing Care', description: 'Professional nursing services at home including medication management, vital monitoring, wound care, and health assessments by qualified nurses.', category: 'nursing', icon: 'Stethoscope', duration: 'Flexible', basePrice: 800, requiredQualification: 'BSc Nursing or equivalent', isActive: true },
    { name: 'Elderly Attendant', description: 'Trained attendants providing daily care, personal hygiene assistance, mobility support, companionship, and meal preparation for seniors.', category: 'attendant', icon: 'Heart', duration: 'Flexible', basePrice: 400, requiredQualification: 'Certified Caregiver', isActive: true },
    { name: 'Physiotherapy', description: 'In-home physiotherapy sessions for joint mobility, pain management, post-surgery rehabilitation, and strength training by licensed physiotherapists.', category: 'physiotherapy', icon: 'Activity', duration: '1-2 hours per session', basePrice: 1000, requiredQualification: 'BPT/MPT', isActive: true },
    { name: 'Post-Hospital Care', description: 'Comprehensive recovery care after hospitalization including wound care, medication management, physiotherapy support, and health monitoring.', category: 'post-hospital', icon: 'ShieldCheck', duration: 'As prescribed', basePrice: 600, requiredQualification: 'GNM Nursing or equivalent', isActive: true },
  ]);

  // Create patients
  const patient1 = await Patient.create({
    userId: user1._id,
    name: 'Shanti Devi Kumar',
    age: 78,
    gender: 'female',
    medicalConditions: ['Diabetes Type 2', 'Hypertension', 'Arthritis'],
    allergies: ['Penicillin'],
    emergencyContact: { name: 'Rajesh Kumar', phone: '9876543210', relation: 'Son' },
    specialNotes: 'Requires insulin injection twice daily. Needs assistance with mobility.',
  });

  const patient2 = await Patient.create({
    userId: user2._id,
    name: 'Ram Prasad Sharma',
    age: 82,
    gender: 'male',
    medicalConditions: ['Heart Disease', 'Parkinson\'s'],
    allergies: [],
    emergencyContact: { name: 'Priya Sharma', phone: '9876543211', relation: 'Daughter' },
    specialNotes: 'Post heart bypass surgery. Needs regular physiotherapy.',
  });

  // Create sample bookings
  const caregivers = await Caregiver.find();
  await Booking.insertMany([
    { userId: user1._id, patientId: patient1._id, caregiverId: caregivers[0]._id, serviceId: services[0]._id, bookingType: 'daily', startDate: new Date(), endDate: new Date(Date.now() + 7 * 86400000), scheduledTime: '09:00 AM', status: 'in-progress', totalAmount: 35000 },
    { userId: user2._id, patientId: patient2._id, caregiverId: caregivers[2]._id, serviceId: services[2]._id, bookingType: 'hourly', startDate: new Date(), endDate: new Date(Date.now() + 1 * 86400000), scheduledTime: '10:00 AM', status: 'accepted', totalAmount: 2000 },
    { userId: user1._id, patientId: patient1._id, caregiverId: caregivers[1]._id, serviceId: services[1]._id, bookingType: 'long-term', startDate: new Date(Date.now() - 30 * 86400000), endDate: new Date(Date.now() - 1 * 86400000), scheduledTime: '08:00 AM', status: 'completed', totalAmount: 60000, rating: 5, review: 'Excellent care! Suresh was very attentive and professional.' },
    { userId: user2._id, patientId: patient2._id, caregiverId: caregivers[3]._id, serviceId: services[3]._id, bookingType: 'daily', startDate: new Date(Date.now() + 3 * 86400000), endDate: new Date(Date.now() + 10 * 86400000), scheduledTime: '07:00 AM', status: 'pending', totalAmount: 28000 },
  ]);

  return { message: 'Database seeded successfully!' };
}

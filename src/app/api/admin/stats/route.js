import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Caregiver from '@/models/Caregiver';
import Booking from '@/models/Booking';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCaregivers = await Caregiver.countDocuments();
    const verifiedCaregivers = await Caregiver.countDocuments({ isVerified: true });
    const pendingCaregivers = await Caregiver.countDocuments({ isVerified: false });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in-progress'] } });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const activeServices = await Service.countDocuments({ isActive: true });

    const revenueResult = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ratingResult = await Booking.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;
    const totalReviews = ratingResult.length > 0 ? ratingResult[0].count : 0;

    const recentBookings = await Booking.find()
      .populate('userId', 'name')
      .populate('serviceId', 'name category')
      .populate('caregiverId')
      .sort({ createdAt: -1 })
      .limit(10);

    const bookingsByService = await Booking.aggregate([
      { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $group: { _id: '$service.category', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { '_id': 1 } }
    ]);

    return NextResponse.json({
      totalUsers,
      totalCaregivers,
      verifiedCaregivers,
      pendingCaregivers,
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      activeServices,
      totalRevenue,
      avgRating,
      totalReviews,
      recentBookings,
      bookingsByService,
      monthlyBookings,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

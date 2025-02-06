import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './utils/mongo_utils.js';

dotenv.config({ path: './config/config.env' });

const ReservationSchema = new mongoose.Schema({
    bookingId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
    userId: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'MassageShop' },
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

const runAggregation = async () => {
    try {
        await connectDB(console);

        const results = await Reservation.aggregate([
            {
                $lookup: {
                    from: 'massage_shops',
                    localField: 'shopId',
                    foreignField: '_id',
                    as: 'shopDetails',
                },
            },
        ]);

        console.log('Aggregation Results:', results);
        mongoose.connection.close();
    } catch (error) {
        console.error('Aggregation Error:', error);
    }
};

runAggregation();

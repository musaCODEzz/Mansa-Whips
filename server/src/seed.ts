import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle';
import Inquiry from './models/Inquiry';
import { INITIAL_VEHICLES, INITIAL_INQUIRIES } from './seedData';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mansawhips';

async function seed() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Starting database seeding...');

    // Clear existing collections
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles collection.');

    await Inquiry.deleteMany({});
    console.log('Cleared existing inquiries collection.');

    // Prepare and insert vehicles (stripping manual string 'id' so Mongo generates standard ObjectIds)
    const vehiclesToInsert = (INITIAL_VEHICLES as any[]).map(({ id, ...rest }) => rest);
    const seededVehicles = await Vehicle.insertMany(vehiclesToInsert);
    console.log(`Successfully seeded ${seededVehicles.length} vehicles.`);

    // Prepare and insert inquiries (stripping manual string 'id')
    const inquiriesToInsert = (INITIAL_INQUIRIES as any[]).map(({ id, ...rest }) => rest);
    const seededInquiries = await Inquiry.insertMany(inquiriesToInsert);
    console.log(`Successfully seeded ${seededInquiries.length} inquiries.`);

    console.log('Database seeding finished successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Critical failure seeding database:', error);
    process.exit(1);
  }
}

seed();

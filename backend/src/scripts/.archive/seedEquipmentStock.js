import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Equipment from '../models/Equipment.js';

dotenv.config();

const seedEquipment = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Connected to MongoDB for Equipment seeding...');

        const equipmentData = [
            // Media/Camera
            { name: 'Canon EOS R6 Camera', category: 'camera', status: 'good', qr_code: 'INV-CAM-001' },
            { name: 'Sony A7 IV Camera', category: 'camera', status: 'good', qr_code: 'INV-CAM-002' },
            { name: 'DJI Ronin Stabilizer', category: 'camera', status: 'good', qr_code: 'INV-STA-001' },

            // Audio
            { name: 'Rode Wireless Go II', category: 'audio', status: 'good', qr_code: 'INV-MIC-001' },
            { name: 'Audio System Yamaha', category: 'audio', status: 'good', qr_code: 'INV-AUD-001' },

            // Projectors
            { name: 'Projector Epson EB-X06', category: 'projector', status: 'good', qr_code: 'INV-PRO-001' },
            { name: 'BenQ 4K HDR Projector', category: 'projector', status: 'good', qr_code: 'INV-PRO-002' },

            // Laptop
            { name: 'MacBook Pro M2 14"', category: 'laptop', status: 'good', qr_code: 'INV-LAP-001' },
            { name: 'MacBook Pro M2 16"', category: 'laptop', status: 'good', qr_code: 'INV-LAP-002' },
            { name: 'Dell XPS 15 Laptop', category: 'laptop', status: 'good', qr_code: 'INV-LAP-003' },

            // Tablet
            { name: 'iPad Pro 12.9" 5th Gen', category: 'tablet', status: 'good', qr_code: 'INV-TAB-001' },
            { name: 'Wacom Intuos Pro M', category: 'tablet', status: 'good', qr_code: 'INV-WAC-001' },

            // Monitors
            { name: 'Dell UltraSharp 27"', category: 'monitor', status: 'good', qr_code: 'INV-MON-001' },
            { name: 'LG Ultrafine 4K', category: 'monitor', status: 'good', qr_code: 'INV-MON-002' },

            // Network
            { name: 'Cisco Router ASR 1001', category: 'network', status: 'good', qr_code: 'INV-NET-001' },
            { name: 'Ubiquiti UniFi AP', category: 'network', status: 'good', qr_code: 'INV-NET-002' },

            // Lab Equipment
            { name: 'Digital Multimeter', category: 'lab', status: 'good', qr_code: 'INV-LAB-001' },
            { name: 'Oscilloscope 100MHz', category: 'lab', status: 'good', qr_code: 'INV-LAB-002' },
        ];

        // We don't want to clear EVERYTHING here because room-tied equipment might be needed.
        // But we can delete items starting with 'INV-' to allow re-runs.
        await Equipment.deleteMany({ qr_code: { $regex: /^INV-/ } });
        console.log('Cleared existing inventory items starting with INV-');

        await Equipment.insertMany(equipmentData);

        console.log(`✅ Successfully seeded ${equipmentData.length} available equipment items!`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding equipment:', error);
        process.exit(1);
    }
};

seedEquipment();

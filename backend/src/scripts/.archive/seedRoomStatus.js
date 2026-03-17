import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import Equipment from '../models/Equipment.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Connected to MongoDB for seeding...');

        // 1. Clear existing data to ensure a clean state
        await Building.deleteMany({});
        await Room.deleteMany({});
        await Equipment.deleteMany({});
        console.log('Cleared existing buildings, rooms, and equipment.');

        // 2. Create Buildings
        const buildingsData = [
            { name: 'Gamma Building', status: 'active' },
            { name: 'Beta Building', status: 'active' },
            { name: 'Alpha Building', status: 'active' },
        ];
        const createdBuildings = await Building.insertMany(buildingsData);
        const gamma = createdBuildings[0];
        const beta = createdBuildings[1];
        const alpha = createdBuildings[2];

        // 3. Create ~20 Rooms
        const roomsData = [
            // Gamma - Floor 4 & 5
            { name: 'G405', type: 'lab', floor: 4, building_id: gamma._id, labels: ['COMPUTER LAB'] },
            { name: 'G412', type: 'lab', floor: 4, building_id: gamma._id, labels: ['ELECTRONICS LAB', 'SPECIALIZED FACILITY'] },
            { name: 'G402', type: 'classroom', floor: 4, building_id: gamma._id, labels: ['SMART CLASSROOM'] },
            { name: 'G501', type: 'lab', floor: 5, building_id: gamma._id, labels: ['AI RESEARCH LAB'] },
            { name: 'G505', type: 'meeting', floor: 5, building_id: gamma._id, labels: ['CONFERENCE ROOM'] },
            { name: 'G510', type: 'lab', floor: 5, building_id: gamma._id, labels: ['ROBOTICS LAB'] },

            // Beta - Floor 1, 2, 3
            { name: 'B101', type: 'classroom', floor: 1, building_id: beta._id, labels: ['LARGE LECTURE HALL'] },
            { name: 'B102', type: 'classroom', floor: 1, building_id: beta._id, labels: ['STANDARD CLASSROOM'] },
            { name: 'B201', type: 'lab', floor: 2, building_id: beta._id, labels: ['PHYSICS LAB'] },
            { name: 'B202', type: 'lab', floor: 2, building_id: beta._id, labels: ['CHEMISTRY LAB'] },
            { name: 'B301', type: 'office', floor: 3, building_id: beta._id, labels: ['FACULTY LOUNGE'] },
            { name: 'B305', type: 'meeting', floor: 3, building_id: beta._id, labels: ['INTERVIEW ROOM'] },
            { name: 'B310', type: 'classroom', floor: 3, building_id: beta._id, labels: ['SMART CLASSROOM'] },

            // Alpha - Floor 1 & 2
            { name: 'A101', type: 'classroom', floor: 1, building_id: alpha._id, labels: ['AUDITORIUM', 'MAIN HALL'] },
            { name: 'A102', type: 'classroom', floor: 1, building_id: alpha._id, labels: ['CONFERENCE HALL', 'VIP READY'] },
            { name: 'A105', type: 'classroom', floor: 1, building_id: alpha._id, labels: ['SEMINAR ROOM', 'STANDARD CAPACITY'] },
            { name: 'A201', type: 'lab', floor: 2, building_id: alpha._id, labels: ['NETWORKING LAB'] },
            { name: 'A205', type: 'lab', floor: 2, building_id: alpha._id, labels: ['CYBERSECURITY LAB'] },
            { name: 'A210', type: 'office', floor: 2, building_id: alpha._id, labels: ['IT SUPPORT CENTER'] },
            { name: 'A215', type: 'classroom', floor: 2, building_id: alpha._id, labels: ['LANGUAGE LAB'] },
        ];
        const createdRooms = await Room.insertMany(roomsData);

        // 4. Create Equipments for Rooms
        const equipments = [];
        let qrCounter = 1000;

        createdRooms.forEach((room, index) => {
            // Add typical devices to every room
            equipments.push({
                name: 'Projector',
                category: 'projector',
                status: index % 7 === 0 ? 'maintenance' : 'good',
                room_id: room._id,
                qr_code: `QR-PROJ-${qrCounter++}`
            });
            equipments.push({
                name: 'Air Conditioning',
                category: 'infrastructure',
                status: index % 10 === 0 ? 'broken' : 'good',
                room_id: room._id,
                qr_code: `QR-AC-${qrCounter++}`
            });

            // Labs get PCs
            if (room.type === 'lab') {
                const pcCount = room.name.includes('G405') ? 40 : 20;
                for (let i = 1; i <= pcCount; i++) {
                    equipments.push({
                        name: `Workstation PC ${i}`,
                        category: 'monitor',
                        status: (i === 5 && index === 0) || (i === 12 && index === 0) ? 'broken' : 'good',
                        room_id: room._id,
                        qr_code: `QR-PC-${room.name}-${i}`
                    });
                }
            }

            // Add specific devices for certain rooms
            if (room.labels.includes('NETWORKING LAB')) {
                equipments.push({ name: 'Server Rack', category: 'network', status: 'good', room_id: room._id, qr_code: `QR-SRV-${qrCounter++}` });
                equipments.push({ name: 'Cisco Switch', category: 'network', status: 'maintenance', room_id: room._id, qr_code: `QR-SW-${qrCounter++}` });
            }
            if (room.labels.includes('CONFERENCE HALL')) {
                equipments.push({ name: 'Audio System', category: 'audio', status: 'good', room_id: room._id, qr_code: `QR-AUD-${qrCounter++}` });
                equipments.push({ name: 'Smart Blinds', category: 'infrastructure', status: 'good', room_id: room._id, qr_code: `QR-BLI-${qrCounter++}` });
            }
        });

        await Equipment.insertMany(equipments);

        console.log('✅ 20+ Rooms and Equipments seeded successfully for Gamma, Beta, Alpha!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        // Log more detail for duplication error
        if (error.code === 11000) {
            console.error('Duplicate key details:', JSON.stringify(error.keyValue));
        }
        process.exit(1);
    }
};

seedData();

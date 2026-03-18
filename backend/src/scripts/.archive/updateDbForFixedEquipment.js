import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';
import Equipment from '../models/Equipment.js';

dotenv.config();

const updateDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('✅ Connected to MongoDB...\n');

        // ─── 1. Ensure Fixed Rooms Exist ──────────────────────────────────────
        let computerLab = await Room.findOne({ name: 'Computer Lab' });
        if (!computerLab) {
            computerLab = await Room.create({ name: 'Computer Lab', type: 'lab', status: 'available', floor: 2 });
            console.log('📦 Created room: Computer Lab');
        } else {
            console.log('✔️  Room "Computer Lab" already exists.');
        }

        let lab211 = await Room.findOne({ name: 'Lab211' });
        if (!lab211) {
            lab211 = await Room.create({ name: 'Lab211', type: 'lab', status: 'available', floor: 2 });
            console.log('📦 Created room: Lab211');
        } else {
            console.log('✔️  Room "Lab211" already exists.');
        }

        // ─── 2. Clear Old pc_lab and iot_kit Data ─────────────────────────────
        await Equipment.deleteMany({ category: { $in: ['pc_lab', 'iot_kit', 'monitor', 'projector'] } });
        console.log('\n🗑️  Cleared all old pc_lab / iot_kit / monitor / projector items.');

        // ─── 3. Seed 40 PC Lab Machines → Computer Lab ───────────────────────
        const pcLabEquipment = [];

        // Dell OptiPlex 7090 — 20 units
        for (let i = 1; i <= 20; i++) {
            const num = String(i).padStart(3, '0');
            pcLabEquipment.push({
                name: 'Dell OptiPlex 7090',
                category: 'pc_lab',
                status: 'good',
                room_id: computerLab._id,
                qr_code: `PC-DELL-${num}`,
            });
        }

        // HP EliteDesk 800 G6 — 10 units
        for (let i = 1; i <= 10; i++) {
            const num = String(i).padStart(3, '0');
            pcLabEquipment.push({
                name: 'HP EliteDesk 800 G6',
                category: 'pc_lab',
                status: 'good',
                room_id: computerLab._id,
                qr_code: `PC-HP-${num}`,
            });
        }

        // Lenovo ThinkCentre M70q — 10 units
        for (let i = 1; i <= 10; i++) {
            const num = String(i).padStart(3, '0');
            pcLabEquipment.push({
                name: 'Lenovo ThinkCentre M70q',
                category: 'pc_lab',
                status: 'good',
                room_id: computerLab._id,
                qr_code: `PC-LEN-${num}`,
            });
        }

        await Equipment.insertMany(pcLabEquipment);
        console.log(`💻 Seeded ${pcLabEquipment.length} PC Lab machines → Computer Lab`);

        // ─── 4. Seed IoT Kit Equipment → Lab211 ───────────────────────────────
        const iotKitEquipment = [
            // Microcontrollers
            { name: 'Arduino Uno R3',           category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ARD-001' },
            { name: 'Arduino Uno R3',           category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ARD-002' },
            { name: 'Arduino Uno R3',           category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ARD-003' },
            { name: 'Arduino Mega 2560',        category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ARD-004' },
            { name: 'Arduino Mega 2560',        category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ARD-005' },

            // Raspberry Pi
            { name: 'Raspberry Pi 4 Model B',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-RPI-001' },
            { name: 'Raspberry Pi 4 Model B',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-RPI-002' },
            { name: 'Raspberry Pi 4 Model B',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-RPI-003' },
            { name: 'Raspberry Pi Pico W',      category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-RPI-004' },
            { name: 'Raspberry Pi Pico W',      category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-RPI-005' },

            // ESP Modules
            { name: 'ESP32 Development Kit',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ESP-001' },
            { name: 'ESP32 Development Kit',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ESP-002' },
            { name: 'ESP32 Development Kit',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ESP-003' },
            { name: 'ESP8266 NodeMCU Module',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ESP-004' },
            { name: 'ESP8266 NodeMCU Module',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ESP-005' },

            // STM32
            { name: 'STM32 Nucleo-64 Board',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-STM-001' },
            { name: 'STM32 Nucleo-64 Board',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-STM-002' },

            // Sensor Kits
            { name: 'IoT Sensor Starter Kit',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-SNS-001' },
            { name: 'IoT Sensor Starter Kit',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-SNS-002' },
            { name: 'IoT Sensor Starter Kit',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-SNS-003' },
            { name: 'Temperature & Humidity Sensor DHT22', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-DHT-001' },
            { name: 'PIR Motion Sensor Module', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-PIR-001' },
            { name: 'Ultrasonic Sensor HC-SR04', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ULT-001' },

            // Measurement Tools
            { name: 'Digital Oscilloscope 100MHz', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-OSC-001' },
            { name: 'Digital Oscilloscope 100MHz', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-OSC-002' },
            { name: 'Digital Multimeter',       category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-DMM-001' },
            { name: 'Digital Multimeter',       category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-DMM-002' },
            { name: 'Logic Analyzer 16 Channel', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-LGA-001' },

            // Accessories
            { name: 'Breadboard 830 Points Kit', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-BRD-001' },
            { name: 'Breadboard 830 Points Kit', category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-BRD-002' },
            { name: 'Jumper Wire Kit 120pcs',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-JMP-001' },
            { name: 'Power Supply Module 5V',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-PWR-001' },

            // Robotics
            { name: 'Robot Car Chassis Kit',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ROB-001' },
            { name: 'Robot Car Chassis Kit',    category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-ROB-002' },
            { name: 'Servo Motor SG90 Kit',     category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-SRV-001' },
            { name: 'Stepper Motor 28BYJ-48',   category: 'iot_kit', status: 'good', room_id: lab211._id, qr_code: 'IOT-STP-001' },
        ];

        await Equipment.insertMany(iotKitEquipment);
        console.log(`🔌 Seeded ${iotKitEquipment.length} IoT Kit items → Lab211`);

        // ─── 5. Ensure other equipment stays with null room ───────────────────
        const othersUpdate = await Equipment.updateMany(
            { category: { $nin: ['iot_kit', 'pc_lab'] } },
            { $set: { room_id: null } }
        );
        console.log(`\n📦 Confirmed ${othersUpdate.modifiedCount} other items have no fixed room (null)`);

        console.log('\n✅ Database update completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating database:', error);
        process.exit(1);
    }
};

updateDatabase();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Equipment from '../models/Equipment.js';

dotenv.config();

// ── Design rule: max ~20 chars so names fit in one line on the card ──────────
// Old name (exact match) → New name
const IOT_RENAMES = [
    // Microcontrollers
    { old: 'Arduino Uno R3',            newName: 'Arduino Uno R3' },        // short enough
    { old: 'Arduino Mega 2560',         newName: 'Arduino Mega 2560' },     // short enough
    { old: 'Raspberry Pi 4 Model B',    newName: 'Raspberry Pi 4B' },
    { old: 'Raspberry Pi Pico W',       newName: 'Raspberry Pico W' },
    { old: 'ESP32 Development Kit',     newName: 'ESP32 Dev Kit' },
    { old: 'ESP8266 NodeMCU Module',    newName: 'ESP8266 NodeMCU' },
    { old: 'STM32 Nucleo-64 Board',     newName: 'STM32 Nucleo-64' },

    // Sensor Kits
    { old: 'IoT Sensor Starter Kit',            newName: 'IoT Sensor Kit' },
    { old: 'Temperature & Humidity Sensor DHT22', newName: 'DHT22 Sensor' },
    { old: 'PIR Motion Sensor Module',          newName: 'PIR Motion Sensor' },
    { old: 'Ultrasonic Sensor HC-SR04',         newName: 'HC-SR04 Sensor' },

    // Measurement
    { old: 'Digital Oscilloscope 100MHz',       newName: 'Oscilloscope 100MHz' },
    { old: 'Digital Multimeter',                newName: 'Digital Multimeter' }, // short
    { old: 'Logic Analyzer 16 Channel',         newName: 'Logic Analyzer 16CH' },

    // Accessories
    { old: 'Breadboard 830 Points Kit',         newName: 'Breadboard 830pt' },
    { old: 'Jumper Wire Kit 120pcs',            newName: 'Jumper Wire Kit' },
    { old: 'Power Supply Module 5V',            newName: 'Power Supply 5V' },

    // Robotics
    { old: 'Robot Car Chassis Kit',             newName: 'Robot Car Kit' },
    { old: 'Servo Motor SG90 Kit',              newName: 'Servo Motor SG90' },
    { old: 'Stepper Motor 28BYJ-48',            newName: 'Stepper 28BYJ-48' },
];

// PC renames: PC-01 → PC-40 sequential
const PC_MODELS = [
    { prefix: 'PC-DELL', brand: 'Dell OptiPlex 7090', count: 20, startIdx: 1 },
    { prefix: 'PC-HP',   brand: 'HP EliteDesk 800 G6', count: 10, startIdx: 21 },
    { prefix: 'PC-LEN',  brand: 'Lenovo ThinkCentre M70q', count: 10, startIdx: 31 },
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('✅ Connected to MongoDB\n');

        // ── 1. Rename IoT Kit equipment ──────────────────────────────────
        let iotTotal = 0;
        for (const { old, newName } of IOT_RENAMES) {
            if (old === newName) continue; // skip unchanged
            const result = await Equipment.updateMany(
                { name: old, category: 'iot_kit' },
                { $set: { name: newName } }
            );
            if (result.modifiedCount > 0) {
                console.log(`🔌 [IoT] "${old}" → "${newName}" (${result.modifiedCount} items)`);
                iotTotal += result.modifiedCount;
            }
        }
        console.log(`\n✔️  Total IoT renamed: ${iotTotal}\n`);

        // ── 2. Rename PC Lab equipment → PC-01 to PC-40 ─────────────────
        // Find each brand group and rename them in order
        const brandGroups = [
            { brand: 'Dell OptiPlex 7090',   startIdx: 1 },
            { brand: 'HP EliteDesk 800 G6',  startIdx: 21 },
            { brand: 'Lenovo ThinkCentre M70q', startIdx: 31 },
        ];

        let pcTotal = 0;
        for (const { brand, startIdx } of brandGroups) {
            const docs = await Equipment.find({ name: brand, category: 'pc_lab' }).sort({ _id: 1 });
            for (let i = 0; i < docs.length; i++) {
                const newNum  = String(startIdx + i).padStart(2, '0');
                const newName = `PC-${newNum}`;
                await Equipment.updateOne(
                    { _id: docs[i]._id },
                    { $set: { name: newName, qr_code: newName } }
                );
                pcTotal++;
            }
        }
        console.log(`💻 Total PCs renamed: ${pcTotal} (PC-01 → PC-40)\n`);

        console.log('✅ Done!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

run();

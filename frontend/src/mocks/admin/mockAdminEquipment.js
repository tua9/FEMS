const generateMockAssets = () => {
 const assets= [];

 // Laptops (10 units)
 const laptops = [
 { name: 'MacBook Pro M3', desc: 'M3 Chip, 16GB RAM, 512GB SSD', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1026' },
 { name: 'Dell XPS 15', desc: 'Intel i9, 32GB RAM, 1TB SSD, OLED Display', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Lenovo ThinkPad X1', desc: 'Intel i7, 16GB RAM, Carbon Fiber Chassis', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000' },
 { name: 'ASUS ROG Zephyrus', desc: 'RTX 4080, 32GB RAM, 240Hz Display', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000' },
 { name: 'HP Spectre x360', desc: '2-in-1 Laptop, Intel i7, touch screen', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=1000' },
 ];

 laptops.forEach((l, i) => {
 assets.push({
 id: `ASSET-LP-${100 + i}1`,
 name: l.name,
 category: 'Laptop',
 location: 'Lab 402',
 status: i % 3 === 0 ? 'In Use' : 'Available',
 imageUrl: l.img,
 description: l.desc,
 purchaseDate: '2023-08-12',
 warranty: '2025-08-12'
 });
 assets.push({
 id: `ASSET-LP-${100 + i}2`,
 name: l.name,
 category: 'Laptop',
 location: 'Library 2F',
 status: 'Available',
 imageUrl: l.img,
 description: l.desc,
 purchaseDate: '2023-08-12',
 warranty: '2025-08-12'
 });
 });

 // Photography (10 units)
 const photography = [
 { name: 'DJI Osmo Pocket 3', desc: '1-inch CMOS Gimbal Camera, 4K/120fps', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Sony A7 IV', desc: 'Full-frame Mirrorless, 33MP', img: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Canon EOS R6', desc: 'High-speed Mirrorless for professional use', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1000' },
 { name: 'GoPro Hero 12', desc: 'Action camera, waterproof, 5.3K video', img: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Fujifilm X-T5', desc: 'APS-C Mirrorless, 40MP, Retro design', img: 'https://images.unsplash.com/photo-1563214594-82a465063077?auto=format&fit=crop&q=80&w=1000' },
 ];

 photography.forEach((p, i) => {
 assets.push({
 id: `ASSET-PH-${200 + i}1`,
 name: p.name,
 category: 'Photography',
 location: 'Media Studio',
 status: i === 0 ? 'Maintenance' : 'Available',
 imageUrl: p.img,
 description: p.desc,
 purchaseDate: '2024-01-20',
 warranty: '2026-01-20'
 });
 assets.push({
 id: `ASSET-PH-${200 + i}2`,
 name: p.name,
 category: 'Photography',
 location: 'Media Studio',
 status: 'Available',
 imageUrl: p.img,
 description: p.desc,
 purchaseDate: '2024-01-20',
 warranty: '2026-01-20'
 });
 });

 // Tablets (10 units)
 const tablets = [
 { name: 'iPad Pro 12.9"', desc: 'M2 Chip, Liquid Retina XDR', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Samsung Galaxy Tab S9', desc: 'AMOLED 120Hz, S-Pen included', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Microsoft Surface Pro 9', desc: 'Tablet that can replace your laptop', img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=1000' },
 ];

 tablets.forEach((t, i) => {
 for (let j = 1; j <= 4; j++) {
 const isBroken = (i + j) % 5 === 0;
 assets.push({
 id: `ASSET-TB-${300 + i}${j}`,
 name: t.name,
 category: 'Tablet',
 location: 'Lab 101',
 status: isBroken ? 'Broken' : 'Available',
 imageUrl: t.img,
 description: t.desc,
 issueDescription: isBroken ? (j % 2 === 0 ? 'Cracked screen at the bottom right corner.' : 'Battery swelling, screen slightly detached.') ,
 purchaseDate: '2023-11-05',
 warranty: '2024-11-05'
 });
 }
 });

 // Electronics & IoT (10 units)
 const electronics = [
 { name: 'Soldering Iron Station', desc: 'Digital temperature control, 60W', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Digital Multimeter', desc: 'Auto-ranging, True RMS', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Oscilloscope 100MHz', desc: '4 Channels, Digital storage', img: 'https://images.unsplash.com/photo-1581092921461-7d2dc830050c?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Raspberry Pi 4 Model B', desc: '8GB RAM, Broadcom BCM2711', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Arduino Uno Rev3', desc: 'Microcontroller board based on ATmega328P', img: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=1000' },
 ];

 electronics.forEach((e, i) => {
 assets.push({
 id: `ASSET-EL-${400 + i}1`,
 name: e.name,
 category: 'Electronics',
 location: 'IoT Workshop',
 status: 'Available',
 imageUrl: e.img,
 description: e.desc,
 purchaseDate: '2024-02-10',
 warranty: '2025-02-10'
 });
 assets.push({
 id: `ASSET-EL-${400 + i}2`,
 name: e.name,
 category: 'Electronics',
 location: 'IoT Workshop',
 status: 'Available',
 imageUrl: e.img,
 description: e.desc,
 purchaseDate: '2024-02-10',
 warranty: '2025-02-10'
 });
 });

 // Network & Peripherals (remaining)
 const others = [
 { name: 'Cisco Router AX', desc: 'WiFi 6 Enterprise Grade Router', cat: 'Network', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000' },
 { name: 'Mechanical Keyboard', desc: 'Cherry MX Blue switches, RGB', cat: 'Peripheral', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000' },
 ];

 others.forEach((o, i) => {
 for (let j = 1; j <= 5; j++) {
 assets.push({
 id: `ASSET-OT-${500 + i}${j}`,
 name: o.name,
 category: o.cat,
 location: 'IT Dept',
 status: 'Available',
 imageUrl: o.img,
 description: o.desc,
 purchaseDate: '2023-05-20',
 warranty: '2026-05-20'
 });
 }
 });

 return assets;
};

export const mockEquipmentList= generateMockAssets();

export const mockBrokenEquipmentAttention= mockEquipmentList.filter(a => a.status === 'Broken' || a.status === 'Broken Screen').slice(0, 3);


import React from 'react';

interface Room {
  id: string;
  name: string;
  type: string;
  badge: string;
  devices: { name: string; status: 'ACTIVE' | 'MAINTENANCE' | 'FAULTY' | 'LOCKED' | 'RESETTING'; icon: string }[];
}

const ROOMS: Room[] = [
  {
    id: 'G405',
    name: 'Room G405',
    type: 'Computer Lab',
    badge: '38/40 PCs Operational',
    devices: [
      { name: 'Workstations', status: 'ACTIVE', icon: 'computer' },
      { name: 'Climate Control', status: 'ACTIVE', icon: 'thermostat' },
      { name: 'Projector Unit', status: 'MAINTENANCE', icon: 'videocam' },
    ],
  },
  {
    id: 'G412',
    name: 'Room G412',
    type: 'Electronics Lab',
    badge: 'Specialized Facility',
    devices: [
      { name: 'Soldering Station', status: 'ACTIVE', icon: 'precision_manufacturing' },
      { name: 'Oscilloscope', status: 'FAULTY', icon: 'monitoring' },
      { name: 'Power Supply', status: 'ACTIVE', icon: 'bolt' },
    ],
  },
  {
    id: 'A101',
    name: 'Room A101',
    type: 'Lecture Theatre',
    badge: 'Main Auditorium',
    devices: [
      { name: 'Audio System', status: 'ACTIVE', icon: 'mic' },
      { name: 'Stage Lighting', status: 'ACTIVE', icon: 'lightbulb' },
      { name: 'Guest WiFi', status: 'ACTIVE', icon: 'wifi' },
    ],
  },
];

const RoomStatus: React.FC = () => {
  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#1E2B58] dark:text-white tracking-tight">
          Room Status Center
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          Live room status and real-time monitoring of facility conditions for faculty and maintenance staff.
        </p>
      </header>

      <div className="glass-card !rounded-[24px] p-2 mb-12 flex flex-wrap gap-2 items-center">
        {['All Buildings', 'All Floors', 'Device Status: All'].map((filter) => (
          <div key={filter} className="flex-grow min-w-[180px] flex items-center">
            <select className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 cursor-pointer">
              <option>{filter}</option>
            </select>
            <div className="h-6 w-px bg-[#1E2B58]/10 hidden md:block"></div>
          </div>
        ))}
        <button className="navy-solid-btn navy-gradient-btn px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 ml-auto">
          <span className="material-symbols-rounded text-lg">search</span>
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {ROOMS.map((room) => (
          <div key={room.id} className="glass-card p-8 flex flex-col group hover:shadow-[#1E2B58]/5 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white">{room.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{room.type}</p>
              </div>
              <div className="bg-[#1E2B58]/5 dark:bg-white/10 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-[#1E2B58] dark:text-white border border-[#1E2B58]/10">
                {room.badge}
              </div>
            </div>

            <div className="space-y-5">
              {room.devices.map((device) => (
                <div
                  key={device.name}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    device.status === 'ACTIVE'
                      ? 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10'
                      : 'bg-white/10 opacity-60 border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-rounded text-2xl ${device.status === 'ACTIVE' ? 'text-[#1E2B58] dark:text-accent-blue' : 'text-slate-400'}`}>
                      {device.icon}
                    </span>
                    <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{device.name}</span>
                  </div>
                  <span className={`text-[10px] font-black ${device.status === 'ACTIVE' ? 'text-[#1E2B58] dark:text-white' : 'text-slate-400'}`}>
                    {device.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomStatus;

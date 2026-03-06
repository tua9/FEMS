import { RoomCard } from '@/components/lecturer/room-status/RoomCard';
import { RoomFilter } from '@/components/lecturer/room-status/RoomFilter';
import { ArrowLeft, Building } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

type DeviceStatus = 'ACTIVE' | 'MAINTENANCE' | 'FAULTY';
type DeviceIcon = 'monitor' | 'thermostat' | 'video' | 'cpu' | 'shield' | 'droplets';
type BuildingKey = 'gamma' | 'alpha';
type FloorKey = '1st' | '4th';

interface Device {
    name: string;
    status: DeviceStatus;
    icon: DeviceIcon;
}

interface RoomData {
    id: string;
    roomName: string;
    roomType: string;
    statusText: string;
    building: BuildingKey;
    floor: FloorKey;
    devices: Device[];
}

// ─── Static room data ─────────────────────────────────────────────────────────

const ALL_ROOMS: RoomData[] = [
    // Gamma Building — Floor 4
    {
        id: 'G405',
        roomName: 'Room G405',
        roomType: 'Computer Lab',
        statusText: '38/40 PCs Operational',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Workstations',    status: 'ACTIVE',      icon: 'monitor'    },
            { name: 'Climate Control', status: 'ACTIVE',      icon: 'thermostat' },
            { name: 'Projector Unit',  status: 'MAINTENANCE', icon: 'video'      },
        ],
    },
    {
        id: 'G412',
        roomName: 'Room G412',
        roomType: 'Electronics Lab',
        statusText: 'Specialized Facility',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Soldering Station', status: 'ACTIVE',  icon: 'cpu'     },
            { name: 'Oscilloscope',      status: 'FAULTY',  icon: 'monitor' },
            { name: 'Power Supply',      status: 'ACTIVE',  icon: 'monitor' },
        ],
    },
    {
        id: 'G402',
        roomName: 'Room G402',
        roomType: 'Smart Classroom',
        statusText: 'All Devices Active',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Interactive TV',  status: 'ACTIVE', icon: 'monitor'    },
            { name: 'Projector',       status: 'ACTIVE', icon: 'video'      },
            { name: 'Air Conditioning',status: 'ACTIVE', icon: 'thermostat' },
        ],
    },
    {
        id: 'G408',
        roomName: 'Room G408',
        roomType: 'Networking Lab',
        statusText: 'Server Maintenance',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Server Rack',  status: 'ACTIVE',      icon: 'cpu'     },
            { name: 'Switch Array', status: 'ACTIVE',      icon: 'shield'  },
            { name: 'Fiber Link',   status: 'MAINTENANCE', icon: 'monitor' },
        ],
    },
    {
        id: 'G410',
        roomName: 'Room G410',
        roomType: 'Robotics Lab',
        statusText: 'Restricted Access',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Robotic Arm',    status: 'ACTIVE',      icon: 'cpu'     },
            { name: 'PLC Controller', status: 'MAINTENANCE', icon: 'monitor' },
            { name: 'Safety Grid',    status: 'ACTIVE',      icon: 'shield'  },
        ],
    },
    {
        id: 'G415',
        roomName: 'Room G415',
        roomType: 'Standard Lab',
        statusText: 'Fully Operational',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'Workstations', status: 'ACTIVE', icon: 'monitor'    },
            { name: 'Ventilation',  status: 'ACTIVE', icon: 'thermostat' },
            { name: 'Projector',    status: 'ACTIVE', icon: 'video'      },
        ],
    },
    {
        id: 'G420',
        roomName: 'Room G420',
        roomType: 'AI Lab',
        statusText: 'Online',
        building: 'gamma',
        floor: '4th',
        devices: [
            { name: 'GPU Cluster',  status: 'ACTIVE', icon: 'cpu'        },
            { name: 'Cooling Unit', status: 'ACTIVE', icon: 'thermostat' },
            { name: 'Data Link',    status: 'ACTIVE', icon: 'monitor'    },
        ],
    },

    // Alpha Building — Floor 1
    {
        id: 'A101',
        roomName: 'Room A101',
        roomType: 'Lecture Theatre',
        statusText: 'Main Auditorium',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Audio System',  status: 'ACTIVE', icon: 'cpu' },
            { name: 'Stage Lighting',status: 'ACTIVE', icon: 'cpu' },
            { name: 'Guest WiFi',    status: 'ACTIVE', icon: 'cpu' },
        ],
    },
    {
        id: 'A102',
        roomName: 'Room A102',
        roomType: 'Conference Hall',
        statusText: 'VIP Ready',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Presentation System', status: 'ACTIVE', icon: 'video'      },
            { name: 'Security Access',     status: 'ACTIVE', icon: 'shield'     },
            { name: 'Ventilation',         status: 'ACTIVE', icon: 'thermostat' },
        ],
    },
    {
        id: 'A105',
        roomName: 'Room A105',
        roomType: 'Seminar Room',
        statusText: 'Standard Capacity',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Lectern Hub',      status: 'ACTIVE',      icon: 'monitor' },
            { name: 'Smart Blinds',     status: 'ACTIVE',      icon: 'shield'  },
            { name: 'Node Access Point',status: 'MAINTENANCE', icon: 'monitor' },
        ],
    },
    {
        id: 'A108',
        roomName: 'Room A108',
        roomType: 'Research Office',
        statusText: 'Quiet Zone',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Smart Desk',   status: 'ACTIVE', icon: 'monitor'    },
            { name: 'Focus Lighting',status: 'ACTIVE', icon: 'cpu'       },
            { name: 'Air Purifier', status: 'ACTIVE', icon: 'thermostat' },
        ],
    },
    {
        id: 'A110',
        roomName: 'Room A110',
        roomType: 'Collaborative Space',
        statusText: 'Fully Booked',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Video Hub',      status: 'ACTIVE', icon: 'video'   },
            { name: 'Whiteboard Tool',status: 'ACTIVE', icon: 'monitor' },
            { name: 'Sound Masking',  status: 'ACTIVE', icon: 'cpu'     },
        ],
    },
    {
        id: 'A112',
        roomName: 'Room A112',
        roomType: 'Meeting Room',
        statusText: 'Available',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Display Screen',  status: 'ACTIVE', icon: 'monitor'    },
            { name: 'Conference Mic',  status: 'ACTIVE', icon: 'cpu'        },
            { name: 'Climate Control', status: 'ACTIVE', icon: 'thermostat' },
        ],
    },
    {
        id: 'A115',
        roomName: 'Room A115',
        roomType: 'Executive Room',
        statusText: 'VIP Access Only',
        building: 'alpha',
        floor: '1st',
        devices: [
            { name: 'Telepresence', status: 'ACTIVE', icon: 'video'  },
            { name: 'Smart Glass',  status: 'ACTIVE', icon: 'shield' },
            { name: 'Premium Audio',status: 'ACTIVE', icon: 'cpu'    },
        ],
    },
];

const BUILDING_LABELS: Record<BuildingKey, string> = {
    gamma: 'Gamma Building',
    alpha: 'Alpha Building',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const RoomStatusCenter: React.FC = () => {
    const navigate = useNavigate();

    // Filter state
    const [building, setBuilding] = useState('all-buildings');
    const [floor,    setFloor]    = useState('all-floors');
    const [status,   setStatus]   = useState('all-status');

    // ── Filter logic ──────────────────────────────────────────────────────────

    const roomMatchesStatus = (room: RoomData, statusFilter: string): boolean => {
        if (statusFilter === 'all-status') return true;
        const hasIssue = room.devices.some(d => d.status === 'MAINTENANCE' || d.status === 'FAULTY');
        if (statusFilter === 'operational') return !hasIssue;
        if (statusFilter === 'maintenance') return hasIssue;
        return true;
    };

    const filteredRooms = useMemo(() => {
        return ALL_ROOMS.filter(room => {
            if (building !== 'all-buildings' && room.building !== building) return false;
            if (floor    !== 'all-floors'    && room.floor    !== floor)    return false;
            if (!roomMatchesStatus(room, status))                            return false;
            return true;
        });
    }, [building, floor, status]);

    // Group filtered rooms by building (only include buildings that have rooms after filtering)
    const roomsByBuilding = useMemo(() => {
        const grouped: Partial<Record<BuildingKey, RoomData[]>> = {};
        const order: BuildingKey[] = ['gamma', 'alpha'];
        for (const b of order) {
            const rooms = filteredRooms.filter(r => r.building === b);
            if (rooms.length > 0) grouped[b] = rooms;
        }
        return grouped;
    }, [filteredRooms]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSearch = () => {
        // Filtering is already reactive; this is a no-op but provides UX feedback.
        // Could trigger a toast / scroll in future iterations.
    };

    const handleReset = () => {
        setBuilding('all-buildings');
        setFloor('all-floors');
        setStatus('all-status');
    };

    const handleReportIssue = (room: RoomData) => {
        navigate('/lecturer/report-issue', {
            state: {
                prefillRoom: room.roomName,
                prefillBuilding: BUILDING_LABELS[room.building],
                hasIssue: room.devices.some(d => d.status === 'MAINTENANCE' || d.status === 'FAULTY'),
            },
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="w-full">
            <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">
                    {/* Back button + Header */}
                    <header className="mb-8 md:mb-12">
                        <button
                            onClick={() => navigate('/lecturer/dashboard')}
                            className="flex items-center gap-2 text-sm font-bold text-[#1E2B58]/60 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E2B58] dark:text-white tracking-tight break-words">
                            Room Status Center
                        </h2>
                        <p className="mt-3 text-[#1E2B58] dark:text-slate-400 opacity-70 font-medium max-w-2xl">
                            Live room status and real-time monitoring of facility conditions for faculty and maintenance staff.
                        </p>
                    </header>

                    {/* Filter bar */}
                    <RoomFilter
                        building={building}  onBuildingChange={setBuilding}
                        floor={floor}        onFloorChange={setFloor}
                        status={status}      onStatusChange={setStatus}
                        onSearch={handleSearch}
                        onReset={handleReset}
                        resultCount={filteredRooms.length}
                        totalCount={ALL_ROOMS.length}
                    />

                    {/* Empty state */}
                    {filteredRooms.length === 0 && (
                        <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4">
                            <Building className="w-10 h-10 text-[#1E2B58]/30 dark:text-white/20" />
                            <p className="text-lg font-black text-[#1E2B58]/50 dark:text-white/40">No rooms match the selected filters.</p>
                            <button
                                onClick={handleReset}
                                className="mt-2 text-sm font-bold text-[#1E2B58] dark:text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Building sections */}
                    {(Object.keys(roomsByBuilding) as BuildingKey[]).map(buildingKey => (
                        <div key={buildingKey} className="mb-16">
                            <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
                                <h3 className="text-lg md:text-xl font-extrabold text-[#1E2B58] dark:text-white flex items-center gap-2">
                                    <Building className="w-5 h-5 md:w-6 md:h-6" />
                                    {BUILDING_LABELS[buildingKey]}
                                </h3>
                                <span className="text-[0.5625rem] md:text-[0.625rem] font-bold text-[#1E2B58]/50 dark:text-white/50 uppercase tracking-widest hidden sm:block">
                                    Scroll to see more rooms
                                </span>
                            </div>

                            <div className="overflow-x-auto hide-scrollbar pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
                                <div className="flex gap-4 md:gap-6 lg:gap-8 min-w-max">
                                    {roomsByBuilding[buildingKey]!.map(room => (
                                        <RoomCard
                                            key={room.id}
                                            roomName={room.roomName}
                                            roomType={room.roomType}
                                            statusText={room.statusText}
                                            devices={room.devices}
                                            onReportIssue={() => handleReportIssue(room)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </div>
    );
};

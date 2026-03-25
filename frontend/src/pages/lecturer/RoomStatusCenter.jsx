import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import { RoomCard } from '@/components/lecturer/room-status/RoomCard';
import { RoomFilter } from '@/components/lecturer/room-status/RoomFilter';
import { useRoomStore } from '@/stores/useRoomStore';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { PageHeader } from '@/components/shared/PageHeader';

// ─── Component ────────────────────────────────────────────────────────────────

export const RoomStatusCenter = () => {
 const navigate = useNavigate();
 const { statusCenterData, fetchStatusCenter, loading } = useRoomStore();
 const { buildings, fetchAll: fetchBuildings } = useBuildingStore();

 // Filter state
 const [building, setBuilding] = useState('all-buildings');
 const [floor, setFloor] = useState('all-floors');
 const [status, setStatus] = useState('all-status');

 useEffect(() => {
 fetchBuildings();
 }, [fetchBuildings]);

 useEffect(() => {
 // Map frontend filter values to backend query params
 const params= {};

 if (building !== 'all-buildings') {
 // Match slug (beta-building) to name (Beta Building)
 const slug = building.toLowerCase().replace(/-/g, ' ');
 const found = buildings.find(b => b.name.toLowerCase().includes(slug));
 if (found) params.building_id = found._id;
 }

 if (floor !== 'all-floors') {
 params.floor = floor.replace(/\D/g, ''); // '1st' -> '1', '4th' -> '4'
 }

 if (status !== 'all-status') {
 if (status === 'operational') params.equipmentStatus = 'active';
 if (status === 'maintenance') params.equipmentStatus = 'faulty'; // Show rooms needing attention
 }

 fetchStatusCenter(params);
 }, [building, floor, status, fetchStatusCenter, buildings]);

 // ── Mapping backend data to UI ───────────────────────────────────────────

 const displayData = useMemo(() => {
 let filtered = statusCenterData.map(group => ({
 buildingKey: group.buildingName.toLowerCase().replace(/\s+/g, '-'),
 buildingName: group.buildingName,
 rooms: group.rooms.map(room => ({
 id: room._id,
 roomName: `Room ${room.name}`,
 roomType: room.type.charAt(0).toUpperCase() + room.type.slice(1),
 statusText: room.operationalSummary,
 building: group.buildingName,
 floorNumber: room.floor,
 floor: getFloorDisplay(room.floor),
 equipment: room.displayEquipment.map(d => ({
 name: d.name,
 status: d.status,
 icon: getIconForEquipment(d.name)
 }))
 }))
 }));

 // Second layer of filtering on frontend to ensure perfect match with UI selectors
 if (building !== 'all-buildings') {
 const slug = building.toLowerCase().replace(/-/g, ' ');
 filtered = filtered.filter(g => g.buildingName.toLowerCase().includes(slug));
 }

 if (floor !== 'all-floors') {
 const floorNum = parseInt(floor.replace(/\D/g, ''));
 filtered = filtered.map(g => ({
 ...g,
 rooms: g.rooms.filter(r => r.floorNumber === floorNum)
 })).filter(g => g.rooms.length > 0);
 }

 return filtered;
 }, [statusCenterData, building, floor]);

 function getFloorDisplay(floor) {
 if (floor === 1) return '1st';
 if (floor === 2) return '2nd';
 if (floor === 3) return '3rd';
 return `${floor}th`;
 }

 // Helper to keep icons consistent with mock
 function getIconForEquipment(name) {
 const n = name.toLowerCase();
 if (n.includes('workstation') || n.includes('pc') || n.includes('monitor') || n.includes('tv')) return 'monitor';
 if (n.includes('climate') || n.includes('air') || n.includes('ventilation') || n.includes('cooling')) return 'thermostat';
 if (n.includes('projector') || n.includes('video')) return 'video';
 if (n.includes('server') || n.includes('cpu') || n.includes('gpu') || n.includes('soldering') || n.includes('plc') || n.includes('mic') || n.includes('audio') || n.includes('power')) return 'cpu';
 if (n.includes('shield') || n.includes('security') || n.includes('safety') || n.includes('access') || n.includes('glass')) return 'shield';
 return 'monitor';
 }

 const resultCount = useMemo(() => {
 return displayData.reduce((acc, curr) => acc + curr.rooms.length, 0);
 }, [displayData]);

 const totalRoomsCount = useMemo(() => {
 // This represents the total unfiltered rooms from the current load
 return statusCenterData.reduce((acc, curr) => acc + curr.rooms.length, 0);
 }, [statusCenterData]);

 // ── Handlers ──────────────────────────────────────────────────────────────

 const handleSearch = () => {
 // Filtering is already reactive
 };

 const handleReset = () => {
 setBuilding('all-buildings');
 setFloor('all-floors');
 setStatus('all-status');
 };

 const handleReportIssue = (room) => {
 navigate('/lecturer/report-issue', {
 state: {
 prefillRoom: room.roomName,
 prefillBuilding: room.buildingName,
 hasIssue: room.equipment.some((d) => d.status === 'MAINTENANCE' || d.status === 'FAULTY'),
 },
 });
 };

 const buildingOptions = useMemo(() => {
 if (buildings.length === 0) return undefined;
 const ops = buildings.map(b => ({ value: b.name.toLowerCase().replace(/\s+/g, '-'), label: b.name }));
 return [{ value: 'all-buildings', label: 'All Buildings' }, ...ops];
 }, [buildings]);

 // ── Render ────────────────────────────────────────────────────────────────

 return (
 <div className="w-full">
 <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
 <div className="w-full">
 <div className="mb-8 md:mb-12">
 <PageHeader
 title="Room Status Center"
 subtitle="Live room status and real-time monitoring of facility conditions for faculty and maintenance staff."
 />
 </div>

 <RoomFilter
 building={building} onBuildingChange={setBuilding}
 floor={floor} onFloorChange={setFloor}
 status={status} onStatusChange={setStatus}
 onSearch={handleSearch}
 onReset={handleReset}
 resultCount={resultCount}
 totalCount={totalRoomsCount}
 buildingOptions={buildingOptions}
 />

 {/* Empty state */}
 {displayData.length === 0 && !loading && (
 <div className="dashboard-card rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4">
 <BuildingIcon className="w-10 h-10 text-[#1E2B58]/30 dark:text-white/20" />
 <p className="text-lg font-black text-[#1E2B58]/50 dark:text-white/40">No rooms match the selected filters.</p>
 <button
 onClick={handleReset}
 className="mt-2 text-sm font-bold text-[#1E2B58] dark:text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
 >
 Clear filters
 </button>
 </div>
 )}

 {loading && (
 <div className="flex justify-center py-20">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E2B58]" />
 </div>
 )}

 {/* Building sections */}
 {displayData.map(group => (
 <div key={group.buildingKey} className="mb-16">
 <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
 <h3 className="text-lg md:text-xl font-extrabold text-[#1E2B58] dark:text-white flex items-center gap-2">
 <BuildingIcon className="w-5 h-5 md:w-6 md:h-6" />
 {group.buildingName}
 </h3>
 <span className="text-[0.5625rem] md:text-[0.625rem] font-bold text-[#1E2B58]/50 dark:text-white/50 uppercase tracking-widest hidden sm:block">
 Scroll to see more rooms
 </span>
 </div>

 <div className="overflow-x-auto hide-scrollbar pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
 <div className="flex gap-4 md:gap-6 lg:gap-8 min-w-max">
 {group.rooms.map(room => (
 <RoomCard
 key={room.id}
 roomName={room.roomName}
 roomType={room.roomType}
 statusText={room.statusText}
 equipment={room.equipment}
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

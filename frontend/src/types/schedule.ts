export type ScheduleType = 'class' | 'meeting' | 'lab_session';
export type ScheduleStatus = 'active' | 'upcoming' | 'completed';

export interface Schedule {
    _id: string;
    title: string;
    type: ScheduleType;
    date: string; // ISO format
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    location: string;
    user_id: string;
    status: ScheduleStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSchedulePayload {
    title: string;
    type: ScheduleType;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    status: ScheduleStatus;
}

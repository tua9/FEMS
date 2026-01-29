import React from 'react';
import InfoField from './InfoField';

interface ProfileInfoGridProps {
    email: string;
    major: string;
    phone: string;
    campus: string;
    dob: string;
    citizenshipId: string;
}

const ProfileInfoGrid: React.FC<ProfileInfoGridProps> = ({
    email,
    major,
    phone,
    campus,
    dob,
    citizenshipId,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <InfoField label="Email Address" value={email} icon="mail" />
            <InfoField label="Major" value={major} icon="school" />
            <InfoField label="Phone Number" value={phone} icon="phone" />
            <InfoField label="Campus" value={campus} icon="location_city" />
            <InfoField label="Date of Birth" value={dob} icon="calendar_today" />
            <InfoField label="Citizenship ID" value={citizenshipId} icon="badge" />
        </div>
    );
};

export default ProfileInfoGrid;
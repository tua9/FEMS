import ProfileActions from '@/components/student/profile/ProfileActions';
import ProfileAvatarSection from '@/components/student/profile/ProfileAvatarSection';
import ProfileHeader from '@/components/student/profile/ProfileHeader';
import ProfileInfoGrid from '@/components/student/profile/ProfileInfoGrid';
import React from 'react';


const Profile: React.FC = () => {
  // Mock user data - later fetch from API or context
  const user = {
    name: 'Nguyen Van A',
    studentId: 'SE123456',
    email: 'angvse123456@fpt.edu.vn',
    major: 'Software Engineering',
    phone: '+84 987 654 321',
    campus: 'Da Nang',
    dob: 'January 15, 2002',
    citizenshipId: '048202001234',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEN1b793kY1IzuwH6AhBg4THRAhN-JBovYTje7ZGjazVNDtsu72U8fdYKy3MV0FmBn6PnnfScPedB4SaDBi6FfEqWdfSW7-0juht7C7_0pbGixLlk-XDsLVX61ZkXNWPVX_EBgSECgI4cbyyg2m3-VMBFi6rGN6wtHQu3wpjb-5L0kc70b0oGrsm0Sr625B7i9oTGud7IUOqDOZD140FWMyoc2eBRCRxaPP5DvbeELgk2tzfSJVM6uVR6Jd17tE4lsy3IjlCo_u2PF',
    status: 'Active Student',
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <ProfileHeader />

      <div className="glass-main rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        <ProfileAvatarSection
          name={user.name}
          studentId={user.studentId}
          status={user.status}
          avatar={user.avatar}
        />

        <div className="lg:w-2/3 p-12">
          <ProfileInfoGrid
            email={user.email}
            major={user.major}
            phone={user.phone}
            campus={user.campus}
            dob={user.dob}
            citizenshipId={user.citizenshipId}
          />

          <ProfileActions />
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import { RoleProvider } from './context/RoleContext';
import Navbar from './components/student/navbar/Navbar';
import LecturerNavbar from './components/lecturer/navbar/LecturerNavbar';
import Footer from './components/student/Footer';
import Dashboard from './pages/student/Dashboard';
import EquipmentList from './pages/student/EquipmentList';
import MyHistory from './pages/student/MyHistory';
import ReportIssue from './pages/student/ReportIssue';
import Profile from './pages/student/Profile';
import Notifications from './pages/student/Notifications';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import OTP from './pages/OTP';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import RoomStatus from './pages/lecturer/RoomStatus';
import LecturerEquipment from './pages/lecturer/LecturerEquipment';
import BorrowApproval from './pages/lecturer/BorrowApproval';
import UsageStats from './pages/lecturer/UsageStats';
import LecturerReportIssue from './pages/lecturer/LecturerReportIssue';
import History from './pages/lecturer/History';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';
  const isLecturer = location.pathname.startsWith('/lecturer');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (isLecturer ? <LecturerNavbar /> : <Navbar />)}
      <main className={`flex-grow ${!isAuthPage ? 'pt-32 pb-12' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useDarkMode();

  return (
    <RoleProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/otp" element={<OTP onVerify={() => setIsAuthenticated(true)} />} />
            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/equipment" element={<Navigate to="/student/equipment" replace />} />
            <Route path="/history" element={<Navigate to="/student/history" replace />} />
            <Route path="/report" element={<Navigate to="/student/report" replace />} />
            <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
            <Route path="/notifications" element={<Navigate to="/student/notifications" replace />} />
            <Route path="/change-password" element={<Navigate to="/student/change-password" replace />} />

            <Route path="/student" element={<Dashboard />} />
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/equipment" element={<EquipmentList />} />
            <Route path="/student/history" element={<MyHistory />} />
            <Route path="/student/report" element={<ReportIssue />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/student/change-password" element={<ChangePassword />} />

            <Route path="/lecturer" element={<LecturerDashboard />} />
            <Route path="/lecturer/room-status" element={<RoomStatus />} />
            <Route path="/lecturer/equipment" element={<LecturerEquipment />} />
            <Route path="/lecturer/approval" element={<BorrowApproval />} />
            <Route path="/lecturer/stats" element={<UsageStats />} />
            <Route path="/lecturer/report" element={<LecturerReportIssue />} />
            <Route path="/lecturer/history" element={<History />} />
          </Routes>
        </Layout>
      </HashRouter>
    </RoleProvider>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import Navbar from './components/student/navbar/Navbar';
import TechnicianNavbar from './components/technician/navbar/TechnicianNavbar';
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
import TechnicianFooter from './components/technician/TechnicianFooter';
// Technician Pages
import TechnicianDashboard from './pages/technician/Dashboard';
import TaskDetails from './pages/technician/TaskDetails';
import TaskList from './pages/technician/TaskList';
import TechnicianProfile from './pages/technician/Profile';
import EquipmentInventory from './pages/technician/EquipmentInventory';
import HandoverManagement from './pages/technician/HandoverManagement';
import PerformanceInsights from './pages/technician/PerformanceInsights';
import TechnicianNotifications from './pages/technician/TechnicianNotifications';

// Admin Pages and Layout
import AdminNavbar from './components/admin/common/AdminNavbar';
import AdminFooter from './components/admin/common/AdminFooter';
import AdminDashboard from './pages/admin/Dashboard';
import EquipmentManagement from './pages/admin/EquipmentManagement';
import BorrowingManagement from './pages/admin/BorrowingManagement';
import UserManagement from './pages/admin/UserManagement';
import DamageReports from './pages/admin/DamageReports';
import AdminNotifications from './pages/admin/AdminNotifications';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';
  const isTechnicianPage = location.pathname.startsWith('/technician');
  const isAdminPage = location.pathname.startsWith('/admin');

  // Determine which Navbar to show
  let CurrentNavbar = Navbar;
  if (isTechnicianPage) CurrentNavbar = TechnicianNavbar;
  if (isAdminPage) CurrentNavbar = AdminNavbar;

  // Determine which Footer to show
  let CurrentFooter = Footer;
  if (isTechnicianPage) CurrentFooter = TechnicianFooter;
  if (isAdminPage) CurrentFooter = AdminFooter;

  return (
    <div className={`min-h-screen flex flex-col ${isTechnicianPage || isAdminPage ? 'bg-[#E0EAFC] dark:bg-[#0f172a]' : ''}`}>
      {!isAuthPage && <CurrentNavbar />}
      <main className="flex-grow relative w-full flex flex-col">
        {children}
      </main>
      {!isAuthPage && <CurrentFooter />}

    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useDarkMode();

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/otp" element={<OTP onVerify={() => setIsAuthenticated(true)} />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/history" element={<MyHistory />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Technician Routes */}
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/tasks" element={<TaskList />} />
          <Route path="/technician/tasks/:id" element={<TaskDetails />} />
          <Route path="/technician/history" element={<TaskList />} />
          <Route path="/technician/equipment" element={<EquipmentInventory />} />
          <Route path="/technician/handover" element={<HandoverManagement />} />
          <Route path="/technician/reports" element={<PerformanceInsights />} />
          <Route path="/technician/profile" element={<TechnicianProfile />} />
          <Route path="/technician/notifications" element={<TechnicianNotifications />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/equipment" element={<EquipmentManagement />} />
          <Route path="/admin/borrowing" element={<BorrowingManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<DamageReports />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

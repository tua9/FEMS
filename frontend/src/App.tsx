
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/student/Navbar';
import Footer from './components/student/Footer';
import Dashboard from './pages/student/Dashboard';
import EquipmentList from './pages/student/EquipmentList';
import MyHistory from './pages/student/MyHistory';
import ReportIssue from './pages/student/ReportIssue';
import Profile from './pages/student/Profile';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import OTP from './pages/student/OTP';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${!isAuthPage ? 'pt-32 pb-12' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/otp" element={<OTP onVerify={() => setIsAuthenticated(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/history" element={<MyHistory />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

/**
 * Technician Routes Configuration
 * 
 * Add these routes to your main Router configuration
 */

import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import Dashboard from '@/pages/technician/Dashboard';
import TaskDetails from '@/pages/technician/TaskDetails';
import TaskList from '@/pages/technician/TaskList';
import EquipmentInventory from '@/pages/technician/EquipmentInventory';
import HandoverManagement from '@/pages/technician/HandoverManagement';
import PerformanceInsights from '@/pages/technician/PerformanceInsights';
import TechnicianNotifications from '@/pages/technician/TechnicianNotifications';
import Profile from '@/pages/technician/Profile';

export const technicianRoutes = (
  <>
    {/* Dashboard - Main landing page */}
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />

    {/* Tasks */}
    <Route path="tasks">
      <Route index element={<TaskList />} />
      <Route path=":id" element={<TaskDetails />} />
    </Route>

    {/* Equipment Inventory */}
    <Route path="equipment" element={<EquipmentInventory />} />

    {/* Handover Management */}
    <Route path="handover" element={<HandoverManagement />} />

    {/* Performance Insights */}
    <Route path="reports" element={<PerformanceInsights />} />

    {/* Notifications */}
    <Route path="notifications" element={<TechnicianNotifications />} />

    {/* Profile */}
    <Route path="profile" element={<Profile />} />
  </>
);

/**
 * Route Paths:
 * 
 * /technician               -> Dashboard
 * /technician/dashboard     -> Dashboard
 * /technician/tasks         -> Task List
 * /technician/tasks/:id     -> Task Details
 * /technician/equipment     -> Equipment Inventory
 * /technician/handover      -> Handover Management
 * /technician/reports       -> Performance Insights
 * /technician/notifications  -> Notifications
 * /technician/profile       -> Profile
 */

/**
 * Navigation Examples:
 * 
 * import { useNavigate } from 'react-router-dom';
 * 
 * const navigate = useNavigate();
 * 
 * // Go to dashboard
 * navigate('/technician/dashboard');
 * 
 * // Go to task list
 * navigate('/technician/tasks');
 * 
 * // Go to specific task
 * navigate(`/technician/tasks/${taskId}`);
 * 
 * // Go to profile
 * navigate('/technician/profile');
 * 
 * // Go back
 * navigate(-1);
 */

/**
 * Menu Items for Navigation:
 */
export const technicianMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/technician/dashboard',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'task_alt',
    path: '/technician/tasks',
  },
  {
    id: 'equipment',
    label: 'Equipment',
    icon: 'inventory',
    path: '/technician/equipment',
  },
  {
    id: 'handover',
    label: 'Handover',
    icon: 'handover',
    path: '/technician/handover',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'insights',
    path: '/technician/reports',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    path: '/technician/notifications',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
    path: '/technician/profile',
  },
];

/**
 * Breadcrumb Configuration:
 */
export const technicianBreadcrumbs = {
  '/technician/dashboard': [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/technician/dashboard' },
  ],
  '/technician/tasks': [
    { label: 'Home', path: '/' },
    { label: 'Tasks', path: '/technician/tasks' },
  ],
  '/technician/tasks/:id': [
    { label: 'Home', path: '/' },
    { label: 'Tasks', path: '/technician/tasks' },
    { label: 'Task Details', path: '/technician/tasks/:id' },
  ],
  '/technician/equipment': [
    { label: 'Home', path: '/' },
    { label: 'Equipment', path: '/technician/equipment' },
  ],
  '/technician/handover': [
    { label: 'Home', path: '/' },
    { label: 'Handover', path: '/technician/handover' },
  ],
  '/technician/reports': [
    { label: 'Home', path: '/' },
    { label: 'Reports', path: '/technician/reports' },
  ],
  '/technician/notifications': [
    { label: 'Home', path: '/' },
    { label: 'Notifications', path: '/technician/notifications' },
  ],
  '/technician/profile': [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/technician/profile' },
  ],
};

export default technicianRoutes;

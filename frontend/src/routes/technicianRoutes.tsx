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
import Profile from '@/pages/technician/Profile';

/**
 * Example Router Setup:
 * 
 * <Routes>
 *   <Route path="/technician" element={<TechnicianLayout />}>
 *     {technicianRoutes}
 *   </Route>
 * </Routes>
 */

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
  '/technician/profile': [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/technician/profile' },
  ],
};

export default technicianRoutes;

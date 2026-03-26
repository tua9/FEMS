import AppNavbar from "./AppNavbar";

const ADMIN_LINKS = [
 { name: 'Home', path: '/admin/dashboard' },
 { name: 'Equipment', path: '/admin/equipment' },
 { name: 'Repairs', path: '/admin/repairs' },
 { name: 'Borrowing', path: '/admin/borrowing' },
 { name: 'Schedule', path: '/admin/schedule' },
 { name: 'Users', path: '/admin/users' },
 { name: 'Reports', path: '/admin/reports' },
];

const AdminNavbar = () => (
 <AppNavbar
 portalLabel="ADMIN PORTAL"
 links={ADMIN_LINKS}
 brandIcon="shield_person"
 />
);

export default AdminNavbar;

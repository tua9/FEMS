import AppNavbar from "./AppNavbar";

const TECHNICIAN_LINKS = [
 { name: 'Home', path: '/technician/dashboard' },
 { name: 'Tickets', path: '/technician/tasks' },
 { name: 'Equipment', path: '/technician/equipment' },
];

const TechnicianNavbar = () => (
 <AppNavbar
 portalLabel="TECHNICIAN PORTAL"
 links={TECHNICIAN_LINKS}
 brandIcon="engineering"
 />
);

export default TechnicianNavbar;

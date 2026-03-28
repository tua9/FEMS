import AppNavbar from "./AppNavbar";

const LECTURER_LINKS = [
 { name: "Home", path: "/lecturer/dashboard" },
 { name: "Approval Center", path: "/lecturer/equipment" },
 { name: "Schedule", path: "/lecturer/calendar" },
 { name: "Report Issue", path: "/lecturer/report-issue" },
 { name: "My History", path: "/lecturer/history" },
];

const LecturerNavbar = () => (
 <AppNavbar portalLabel="LECTURER PORTAL" links={LECTURER_LINKS} />
);

export default LecturerNavbar;

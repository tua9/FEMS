import AppNavbar from "./AppNavbar";

const STUDENT_LINKS = [
 { name: "Home", path: "/student/dashboard" },
 { name: "Equipments", path: "/student/equipment" },
 { name: "Schedule", path: "/student/schedule" },
 { name: "My History", path: "/student/history" },
 { name: "Report Issue", path: "/student/report-issue" },
];

const StudentNavBar = () => (
 <AppNavbar portalLabel="STUDENT PORTAL" links={STUDENT_LINKS} />
);

export default StudentNavBar;

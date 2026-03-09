import AppNavbar from "./lecturer/navbar/AppNavbar";

const STUDENT_LINKS = [
  { name: "Home", path: "/student/dashboard" },
  { name: "Equipments", path: "/student/equipment" },
  { name: "Borrow History", path: "/student/borrow-history" },
  { name: "Report Issue", path: "/student/report-issue" },
];

const StudentNavBar = () => (
  <AppNavbar portalLabel="STUDENT PORTAL" links={STUDENT_LINKS} />
);

export default StudentNavBar;

import AppNavbar from "./AppNavbar";

const LECTURER_LINKS = [
  { name: "Home", path: "/lecturer/dashboard" },
  { name: "Room Status", path: "/lecturer/room-status" },
  { name: "Equipment", path: "/lecturer/equipment" },
  { name: "Borrow Approval", path: "/lecturer/approval" },
  { name: "Usage Stats", path: "/lecturer/usage-stats" },
  { name: "Report Issue", path: "/lecturer/report-issue" },
  { name: "My History", path: "/lecturer/history" },
];

const LecturerNavbar = () => (
  <AppNavbar portalLabel="LECTURER PORTAL" links={LECTURER_LINKS} />
);

export default LecturerNavbar;

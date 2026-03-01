export default function Footer() {
  return (
    <footer className="mt-16 pb-12 text-center">
      <div className="text-muted-foreground flex justify-center gap-8 text-2xl">
        <span className="material-symbols-outlined cursor-pointer hover:scale-110">
          school
        </span>
        <span className="material-symbols-outlined cursor-pointer hover:scale-110">
          security
        </span>
        <span className="material-symbols-outlined cursor-pointer hover:scale-110">
          build
        </span>
      </div>
      <p className="text-muted-foreground mt-4 text-xs font-bold tracking-widest uppercase opacity-70">
        Facility & Equipment Management System — F-EMS 2024
      </p>
    </footer>
  );
}

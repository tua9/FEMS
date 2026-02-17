import { NavBar } from "@/components/common/Navbar";
import { useState } from "react";

export default function HomePage() {
  // set Page type Enum
  const [page, setPage] = useState();

  return (
    <>
      <div className="container h-screen border">
        <header className="flex items-center justify-center">
          <NavBar page={page}></NavBar>
        </header>
        <div>Home Page</div>
      </div>
    </>
  );
}

import { Link } from "react-router";
import SwitchMode from "../ui/SwitchMode";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import ProfileDropdown from "../shadcn-studio/blocks/dropdown-profile";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function NavBar() {
  return (
    <>
      <Tabs
        defaultValue="overview"
        className="border-border bg-muted z-50 container mx-auto w-full rounded border p-1"
      >
        <TabsList className="bg-mute flex h-auto w-full justify-between gap-10 rounded-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-sm">
              <span className="material-symbols-outlined text-2xl"></span>
            </div>

            <div className="hidden flex-col md:flex">
              <h1 className="text-foreground text-xl leading-none font-bold tracking-tight">
                F-EMS
              </h1>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Student Portal
              </p>
            </div>
          </div>
          <div className="options">
            <TabsTrigger
              value="home"
              className="data-[state=active]:bg-secondary text-secondary-foreground"
            >
              <Link to="/">Home </Link>
            </TabsTrigger>
            <TabsTrigger
              value="equipment-list"
              className="data-[state=active]:bg-secondary text-secondary-foreground"
            >
              <Link to="/equipments">Equipment List</Link>
            </TabsTrigger>
            <TabsTrigger
              value="my-history"
              className="data-[state=active]:bg-secondary text-secondary-foreground"
            >
              <Link to="/borrow-history">My History</Link>
            </TabsTrigger>
            <TabsTrigger
              value="report-issue"
              className="data-[state=active]:bg-secondary text-secondary-foreground"
            >
              <Link to="/report-issue">Report Issue</Link>
            </TabsTrigger>
          </div>
          <div className="right-navbar flex items-center gap-10">
            <SwitchMode />
            <ProfileDropdown
              trigger={
                <Button variant="ghost" size="icon" className="size-9.5">
                  <Avatar className="size-9.5 rounded-full">
                    <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          </div>
        </TabsList>
      </Tabs>
    </>
  );
}

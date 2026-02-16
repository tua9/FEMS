import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import DropdownMenuUserProfile from "./DropdownMenuUserProfile";

export function NavBar() {
  return (
    <>
      <NavigationMenu>
        <div>
          <img src="/images/logo.jpg" alt="" className="h-8 object-contain" />
        </div>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/">
                <div className="logo">Home</div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/equipments">Equipment List</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/history">My History</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/report-issue">Report Issue</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        <DropdownMenuUserProfile />
      </NavigationMenu>
    </>
  );
}

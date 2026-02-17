import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router";
import Logout from "../auth/Logout";

export default function DropdownMenuUserProfile() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-0" render={<Button />}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <Link to="/login">Profile</Link>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/login">Reset Password</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-alert">
              <Logout></Logout>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

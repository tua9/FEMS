import { useId } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NormalButton } from "../ui/primary-button";

export function SearchBar() {
  const id = useId();
  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-4xl border p-4 md:flex-row md:items-center">
      <div className="flex w-full gap-2">
        <Input
          id={id}
          type="text"
          placeholder="Search devices(e.g, Projector, HDMI...)"
          className="border-border border focus:border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
        />
        <NormalButton>Search</NormalButton>
      </div>
    </div>
  );
}

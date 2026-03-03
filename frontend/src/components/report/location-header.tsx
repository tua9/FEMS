"use client";

import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";

export function LocationHeader() {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-4xl p-4">
      <div className="flex items-center gap-4">
        <div className="bg-background flex h-12 w-12 items-center justify-center rounded-full">
          <MapPin className="text-foreground h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Location/Subject Identified
          </p>
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-lg font-bold">
              Block A - Room 402
            </h2>
            <Badge variant="secondary"> #PPT-LOC-A402</Badge>
          </div>
        </div>
      </div>
      <button className="text-foreground hover:text-accent text-sm font-semibold transition-colors">
        Change Location
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Zap,
  Droplets,
  Wrench,
  Sofa,
  AlertTriangle,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "furniture", label: "Furniture", icon: Sofa },
  { id: "safety", label: "Safety", icon: AlertTriangle },
  { id: "other", label: "Other", icon: LayoutGrid },
];

export function CategorySelector() {
  const [selected, setSelected] = useState("other");

  return (
    <div>
      <h3 className="text-foreground mb-4 text-base font-bold">
        Select Category
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelected(category.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-all",
                isSelected
                  ? "border-border bg-card border shadow-sm"
                  : "bg-secondary hover:border-border hover:bg-card border",
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  isSelected ? "" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold tracking-wider uppercase",
                  isSelected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

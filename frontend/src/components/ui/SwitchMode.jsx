"use client";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/features/shared/components/theme-provider";

const SwitchMode = () => {
 const [checked, setChecked] = useState(false);
 const { theme, setTheme } = useTheme();

 useEffect(() => {
 setTheme(checked ? "dark" : "light");
 }, [checked]);

 return (
 <div className="inline-flex items-center gap-2">
 <Switch
 id="icon-label"
 checked={checked}
 onCheckedChange={setChecked}
 aria-label="Toggle switch"
 className="border-border border"
 />
 <Label htmlFor="icon-label">
 <span className="sr-only">Toggle switch</span>
 {checked ? (
 <MoonIcon className="size-4" aria-hidden="true" />
 ) : (
 <SunIcon className="size-4" aria-hidden="true" />
 )}
 </Label>
 </div>
 );
};

export default SwitchMode;

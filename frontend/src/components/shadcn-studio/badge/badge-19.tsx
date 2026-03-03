import { AlertCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const BadgeInUse = () => {
  return (
    <Badge
      variant="outline"
      className="rounded-all absolute top-2 right-2 border-amber-600 bg-amber-100 text-amber-600 dark:border-amber-400 dark:text-amber-400 [a&]:hover:bg-amber-600/10 [a&]:hover:text-amber-600/90 dark:[a&]:hover:bg-amber-400/10 dark:[a&]:hover:text-amber-400/90"
    >
      <AlertCircleIcon className="size-3" />
      In Use
    </Badge>
  );
};

export default BadgeInUse;

import { CheckCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const BadgeAvailable = () => {
  return (
    <Badge
      variant="outline"
      className="rounded-all absolute top-2 right-2 border-green-600 bg-green-100 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90"
    >
      <CheckCircleIcon className="size-3" />
      Available
    </Badge>
  );
};

export default BadgeAvailable;

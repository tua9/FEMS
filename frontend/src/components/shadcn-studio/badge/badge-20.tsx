import { BanIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const BadgeMaintenace = () => {
  return (
    <Badge
      variant="outline"
      className="rounded-all absolute top-2 right-2 border-red-600 bg-red-100 text-red-600 [a&]:hover:bg-red-600/10 [a&]:hover:text-red-600/90 dark:[a&]:hover:bg-red-400/10 dark:[a&]:hover:text-red-400/90"
    >
      <BanIcon className="size-3" />
      Maintenance
    </Badge>
  );
};

export default BadgeMaintenace;

import type { Equipment } from "@/types/equipment";
import type { BorrowRequest } from "@/types/borrowRequest";

/**
 * Pushes items with 'available' status to the top of the list.
 */
export const sortEquipmentByAvailability = (items: Equipment[]): Equipment[] => {
  return [...items].sort((a, b) => {
    const aIsAvailable = a.status === "available" || a.available === true;
    const bIsAvailable = b.status === "available" || b.available === true;

    if (aIsAvailable && !bIsAvailable) return -1;
    if (!aIsAvailable && bIsAvailable) return 1;
    return 0; // Maintain original sorting for others
  });
};

/**
 * Checks if the user has an active borrow request for the given equipment.
 */
export const hasActiveBorrowRequest = (
  equipmentId: string,
  myRequests: BorrowRequest[]
): BorrowRequest | undefined => {
  const activeStatuses = ["pending", "approved", "handed_over"];
  
  return myRequests.find((req) => {
    const reqEqId = typeof req.equipment_id === "object" ? (req.equipment_id as any)?._id : req.equipment_id;
    return reqEqId === equipmentId && activeStatuses.includes(req.status);
  });
};

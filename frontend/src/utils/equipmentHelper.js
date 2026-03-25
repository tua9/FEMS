/**
 * Pushes items with 'available' status to the top of the list.
 */
export const sortEquipmentByAvailability = (items)=> {
 return [...items].sort((a, b) => {
 const aIsAvailable = (a.status === "good" || a.status === "available") && !a.borrowed_by;
 const bIsAvailable = (b.status === "good" || b.status === "available") && !b.borrowed_by;

 if (aIsAvailable && !bIsAvailable) return -1;
 if (!aIsAvailable && bIsAvailable) return 1;
 return 0; // Maintain original sorting for others
 });
};

/**
 * Checks if the user has an active borrow request for the given equipment.
 */
export const hasActiveBorrowRequest = (
 equipmentId, myRequests) => {
 const activeStatuses = ["pending", "approved", "handed_over"];
 
 return myRequests.find((req) => {
 const reqEqId = typeof req.equipment_id === "object" ? (req.equipment_id)?._id : req.equipment_id;
 return reqEqId === equipmentId && activeStatuses.includes(req.status);
 });
};

import {
 BadgeCheck,
 Calendar,
 Mail,
 Phone,
 School,
} from "lucide-react";

// ─── Role-aware constants ───────────────────────────────────────────────────────
export const ROLE_PREFIX= {
 student: "/student",
 lecturer: "/lecturer",
 admin: "/admin",
 technician: "/technician",
};

export const ROLE_STATUS= {
 student: "Active Student",
 lecturer: "Active Lecturer",
 admin: "Active Admin",
 technician: "Active Technician",
};

export const ROLE_TITLE_ICON= {
 student: "school",
 lecturer: "school",
 admin: "shield_person",
 technician: "engineering",
};

export const ROLE_TITLE_LABEL= {
 student: "Student",
 lecturer: "Senior Lecturer",
 admin: "Super Admin",
 technician: "Technician",
};

// Config for stats per role (icons and labels)
export const ROLE_STATS_CONFIG= {
 student: [
 { label: "Borrows", icon: "inventory_2", key: "borrows" },
 { label: "Reports", icon: "build_circle", key: "reports" },
 ],
 lecturer: [
 { label: "Borrows", icon: "inventory_2", key: "borrows" },
 { label: "Reports", icon: "build_circle", key: "reports" },
 ],
 admin: [
 { label: "Users", icon: "group", key: "users" },
 { label: "Equipment", icon: "devices", key: "equipment" },
 ],
 technician: [
 { label: "Tasks", icon: "task_alt", key: "tasks" },
 { label: "Active", icon: "pending_actions", key: "active" },
 ],
};

export const getInfoFields = (userRole) => {
  const idField = {
    label:
      userRole === "student"
        ? "Student ID"
        : userRole === "admin"
          ? "Admin ID"
          : userRole === "technician"
            ? "Technician ID"
            : "Employee ID",
    icon: BadgeCheck,
    key: "_id",
  };

  const fields = [
    { label: "Email Address", icon: Mail, key: "email" },
    { label: "Phone Number", icon: Phone, key: "phone" },
    { label: "Date of Birth", icon: Calendar, key: "dob" },
  ];

  if (userRole === "student") {
    fields.push({ label: "Student Class", icon: School, key: "classId" });
  }

  fields.push(idField);
  return fields;
};

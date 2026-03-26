import {
  Camera,
  Laptop,
  Mic,
  Monitor,
  TabletSmartphone,
  Video,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 4;

/** Map category id → equipment type filter value */
export const CATEGORY_TO_TYPE: Record<string, string> = {
  all: "all-types",
  laptop: "laptop",
  projector: "projector",
  tablet: "tablet",
  monitor: "monitor",
  camera: "camera",
  audio: "audio",
};

/** Reverse map: type filter value → category id */
export const TYPE_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_TYPE).map(([k, v]) => [v, k]),
);

// ── Mock data ────────────────────────────────────────────────────────────────

export const ALL_EQUIPMENT = [
  {
    id: "1",
    title: "MacBook Pro M2",
    sku: "FPT-LAP-082",
    location: "Lab Room 402",
    locationKey: "gamma",
    type: "laptop",
    status: "Available",
    icon: Laptop,
  },
  {
    id: "2",
    title: "4K Laser Projector",
    sku: "FPT-PJ-014",
    location: "Resource Desk",
    locationKey: "gamma",
    type: "projector",
    status: "Available",
    icon: Video,
  },
  {
    id: "3",
    title: "iPad Air 5th Gen",
    sku: "FPT-TAB-055",
    location: "Library A",
    locationKey: "alpha",
    type: "tablet",
    status: "In Use",
    icon: TabletSmartphone,
  },
  {
    id: "4",
    title: "UltraWide Monitor",
    sku: "FPT-MN-033",
    location: "Room 205",
    locationKey: "gamma",
    type: "monitor",
    status: "Available",
    icon: Monitor,
  },
  {
    id: "5",
    title: "Sony A7 IV Camera",
    sku: "FPT-CAM-011",
    location: "Media Lab",
    locationKey: "alpha",
    type: "camera",
    status: "Available",
    icon: Camera,
  },
  {
    id: "6",
    title: "Focusrite Interface",
    sku: "FPT-AUD-007",
    location: "Studio B",
    locationKey: "alpha",
    type: "audio",
    status: "Available",
    icon: Mic,
  },
  {
    id: "7",
    title: "Dell XPS 15",
    sku: "FPT-LAP-097",
    location: "Lab Room 408",
    locationKey: "gamma",
    type: "laptop",
    status: "Maintenance",
    icon: Laptop,
  },
  {
    id: "8",
    title: "Epson Smart Projector",
    sku: "FPT-PJ-022",
    location: "Seminar Room A",
    locationKey: "alpha",
    type: "projector",
    status: "Available",
    icon: Video,
  },
];

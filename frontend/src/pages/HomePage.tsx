// HomePage.tsx
import EquipmentList from "@/components/common/EquipmentList";
import { SearchBar } from "@/components/common/SearchBar";
import StudentNavBar from "@/components/lecturer/navbar/StudentNavbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, History, Info, type LucideIcon } from "lucide-react";
// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────

function NotificationItem({
  icon: Icon,
  color,
  title,
  message,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  message: string;
}) {
  return (
    <Alert style={{ color: color }}>
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function Sidebar() {
  return (
    <aside className="col-span-12 space-y-6 lg:col-span-3">
      {/* Notifications */}
      <div className="bg-muted border-border rounded border p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Badge className="bg-primary/10 text-primary px-3 py-1">3 New</Badge>
        </div>
        <div className="space-y-4">
          <NotificationItem
            icon={CheckCircle}
            color="#10b981"
            title="Request Approved"
            message="Mac Studio M2 is ready for pickup at Room 402."
          />
          <NotificationItem
            icon={History}
            color="#f59e0b"
            title="Return Reminder"
            message="Projector PT-42 due in 2 hours."
          />
          <NotificationItem
            icon={Info}
            color="#3b82f6"
            title="Maintenance Update"
            message="Lab A-301 is closed for wiring repairs."
          />
        </div>
      </div>

      {/* Stats Card */}
      <StatsCard />
    </aside>
  );
}

function StatsCard() {
  return (
    <Card className="bg-primary text-primary-foreground mx-auto w-full max-w-sm border-0">
      <CardHeader>
        <CardTitle>Total Borrows</CardTitle>
        <CardDescription className="text-primary-foreground">
          <h3 className="mt-1 text-3xl font-bold">
            12 <span className="text-base font-normal opacity-80">Items</span>
          </h3>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={75} />
        <p className="mt-2 text-xs font-medium tracking-wide uppercase opacity-80">
          75% of your semester quota used
        </p>
      </CardContent>
    </Card>
  );
}

function ActiveBorrowCard() {
  return (
    <div className="bg-muted border-border rounded border p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
        <span className="material-symbols-outlined text-primary">
          monitoring
        </span>
        My Active Borrows
      </div>

      <div className="space-y-10">
        {/* Item */}
        <div>
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-muted h-16 w-16 overflow-hidden rounded-xl shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMMVa85EgZIP_A76QkARAZEwPm70Cn5wKIXSGr3v06bUa2UMqjqgkIZfahk4O2VfnUwHlhEOUe6-sF31Jj_8guiKsdFGR2mbCtvVq_8sQ3b7D5923ZoFAc4BsYERd4QbO9aY9I5woraa-whxGlu9OltnvrVN6lsLUbF-O3VOjiy-r4P6_sAZVnUHGqUXDm6XJJIyWTm-aezQxymdNhel949pFdSVyv_R8bomsaB3fNbFQfTYQ7PVQiv2OA6nyGZzms1YzGzA3qobYi"
                  alt="Mac Studio M2"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Mac Studio M2</h4>
                <p className="text-muted-foreground text-sm">
                  Serial: FPT-MS-2024-089
                </p>
              </div>
            </div>
            <div>
              <span className="bg-primary/10 text-primary inline-flex rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase">
                Handover In Progress
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative flex justify-between px-4">
            <div className="bg-border absolute top-1/2 right-0 left-0 h-px -translate-y-1/2" />
            <div className="bg-primary absolute top-1/2 left-0 h-px w-2/3 -translate-y-1/2" />

            {["Pending", "Approved", "Handover", "Returning"].map((step, i) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`ring-background flex h-9 w-9 items-center justify-center rounded-full ring-4 ${
                    i < 2
                      ? "bg-primary text-primary-foreground"
                      : i === 2
                        ? "border-primary bg-background text-primary border-2"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {i === 0 || i === 1
                      ? "check"
                      : i === 2
                        ? "sync"
                        : "keyboard_return"}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight uppercase ${
                    i < 2
                      ? "text-foreground"
                      : i === 2
                        ? "text-primary"
                        : "text-muted-foreground opacity-60"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

//Equipment Item

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="text-foreground bg-background min-h-screen w-full antialiased">
      <main className="gap-6pb-12 grid w-full grid-cols-1 lg:grid-cols-12 lg:gap-8">
        <StudentNavBar />

        {/* Sidebar: ẩn trên mobile, hiện trên lg */}
        <aside className="hidden lg:top-6 lg:col-span-3 lg:block lg:self-start">
          <Sidebar />
        </aside>

        {/* Main content: full width mobile, 9 cột lg */}
        <div className="col-span-1 space-y-8 lg:col-span-9">
          <ActiveBorrowCard />
          <SearchBar />
          <EquipmentList equipments={[]} />
        </div>
      </main>
    </div>
  );
}

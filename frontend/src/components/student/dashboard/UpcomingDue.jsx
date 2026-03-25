import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { AnimatedSection } from "@/components/motion";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";

const UpcomingDue = () => {
 const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);
 const navigate = useNavigate();

 const upcomingItems = [...borrowRequests]
 .filter((r) => ["Approved", "HandedOver"].includes(r.status))
 .sort((a, b) => new Date(a.return_date).getTime() - new Date(b.return_date).getTime())
 .slice(0, 5);

 return (
 <AnimatedSection variant="slide-up" delay={0.15} className="lg:col-span-4">
 <div className="glass-card flex h-full flex-col rounded-[40px] shadow-sm">
 <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
 <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Upcoming Due</h3>
 </div>
 <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6">
 {upcomingItems.map((item) => (
 <button
 key={item._id}
 type="button"
 onClick={() => navigate(`/student/borrow-history`)}
 className="rounded-4xl border border-white/60 bg-white/40 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-white/5"
 >
 <div className="mb-3 flex items-center justify-between">
 <span className="flex items-center gap-2 rounded-full bg-[#1E2B58] px-3 py-1 text-[10px] font-bold text-white">
 <Clock className="h-3 w-3" /> 
 {new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(new Date(item.return_date))}
 </span>
 </div>
 <h4 className="font-black text-[#1E2B58] dark:text-white">{item.type} request</h4>
 </button>
 ))}
 <button
 type="button"
 onClick={() => navigate("/student/borrow-history")}
 className="glass-btn mt-2 w-full rounded-2xl p-4 text-sm font-bold text-[#1E2B58]/60 transition hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
 >
 View All Deadlines
 </button>
 </div>
 </div>
 </AnimatedSection>
 );
};

export default UpcomingDue;

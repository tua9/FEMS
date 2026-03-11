/**
 * StudentStatCard — Thẻ thống kê trên Dashboard của Student.
 * Tách ra từ HomePage để dễ tái sử dụng và test.
 */
import React from "react";
import { Link } from "react-router-dom";
import type { StudentStatCard as StatCardData } from "@/data/student/mockStudentData";

interface StudentStatCardProps {
  card: StatCardData;
}

const StudentStatCard: React.FC<StudentStatCardProps> = ({ card }) => {
  const Icon = card.icon;

  return (
    <Link
      to={card.route}
      className="glass-card group relative flex min-h-42.5 flex-col justify-between gap-4 rounded-4xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* Status dot */}
      <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${card.dot} ${card.glow}`} />

      {/* Icon */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.color} text-white shadow-xl ${card.iconShadow}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Texts */}
      <div>
        <p className="text-xs font-black tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">
          {card.title}
        </p>
        <h3 className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">
          {card.value}
        </h3>
      </div>
    </Link>
  );
};

export default StudentStatCard;

import React from 'react';
import { STAT_CARDS } from '@/data/technician/mockReports';

const ReportStatCards: React.FC = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {STAT_CARDS.map((card) => (
      <div
        key={card.label}
        className="bg-white/60 glass-card p-6 rounded-3xl border border-white/50 shadow-sm"
      >
        {/* Icon row */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center`}
          >
            <span
              className={`material-symbols-outlined ${card.iconColor}`}
              {...(card.fillIcon
                ? { style: { fontVariationSettings: "'FILL' 1" } }
                : {})}
            >
              {card.icon}
            </span>
          </div>
          <span className={`text-xs font-bold ${card.changeColor}`}>{card.changeLabel}</span>
        </div>

        <p className="text-3xl font-extrabold text-[#232F58]">{card.value}</p>
        <p className="text-sm font-semibold text-slate-500">{card.label}</p>
      </div>
    ))}
  </section>
);

export default ReportStatCards;

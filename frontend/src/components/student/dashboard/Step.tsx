type StepProps = {
    icon: string;
    label: string;
    active?: boolean;
    current?: boolean;
};

const Step = ({ icon, label, active, current }: StepProps) => (
    <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-md ${active ? 'btn-navy-gradient text-white' :
            current ? 'bg-white dark:bg-slate-800 border-2 border-navy-deep dark:border-blue-400 text-navy-deep dark:text-blue-400' :
                'bg-slate-100 dark:bg-slate-700 text-slate-400'
            }`}>
            <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-tighter ${active || current ? 'text-navy-deep dark:text-slate-300' : 'opacity-50'}`}>{label}</span>
    </div>
);

export default Step;
type EquipmentCardProps = {
    name: string,
    tag: string,
    img: string,
    available?: boolean
}

const EquipmentCard = ({ name, tag, img, available }: EquipmentCardProps) => (
    <div className={`glass-main p-6 rounded-3xl hover:-translate-y-2 transition-all duration-300 group ${!available ? 'opacity-80' : ''}`}>
        <div className="relative h-48 bg-white/40 dark:bg-slate-800/40 rounded-2xl mb-5 overflow-hidden flex items-center justify-center">
            <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-3 right-3">
                <span className={`${available ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm`}>
                    {available ? 'Available' : 'In Use'}
                </span>
            </div>
        </div>
        <h3 className="font-bold text-xl mb-1 text-[var(--navy-deep)] dark:text-white">{name}</h3>
        <p className="text-sm opacity-60 mb-8 font-medium">{tag}</p>
        {available ? (
            <button className="w-full btn-navy-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                Request Borrow <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
        ) : (
            <button disabled className="w-full bg-slate-200/50 dark:bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl cursor-not-allowed border border-slate-300/30">
                Unavailable
            </button>
        )}
    </div>
);

export default EquipmentCard;
import React from 'react';

const PhotoCaptureSection: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                Visual Evidence
            </h3>
            <div className="relative h-[220px] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-white/40 shadow-inner group">
                <img
                    alt="Camera preview"
                    className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
                    src="https://picsum.photos/seed/room/600/400"
                />
                <div className="absolute inset-0 bg-black/10" />

                <div className="absolute top-4 right-4 bg-red-500 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-tighter">
                        Live View
                    </span>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
                    <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </button>

                    <button
                        type="button"
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 border-4 border-white/20 hover:scale-110 transition-transform"
                    >
                        <div className="w-10 h-10 rounded-full border-2 border-slate-900" />
                    </button>

                    <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">flash_on</span>
                    </button>
                </div>

                <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] italic text-white/70 pointer-events-none">
                    Capture a clear photo of the issue
                </p>
            </div>
        </div>
    );
};

export default PhotoCaptureSection;
import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UserProfile: React.FC = () => {
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 md:min-w-[12rem] justify-end">
            <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 border-r border-[#1E2B58]/10 dark:border-white/10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#1E2B58]/20 dark:border-white/40 hover:bg-white/40 dark:hover:bg-white/10 transition-all cursor-pointer"
                >
                    <Moon className="w-[1.125rem] h-[1.125rem] text-[#1E2B58] dark:text-white hidden dark:block" />
                    <Sun className="w-[1.125rem] h-[1.125rem] text-[#1E2B58] dark:text-white block dark:hidden" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#1E2B58]/20 dark:border-white/40 hover:bg-white/40 dark:hover:bg-white/10 transition-all relative cursor-pointer"
                >
                    <Bell className="w-[1.125rem] h-[1.125rem] text-[#1E2B58] dark:text-white" />
                    <span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1e2b58]"></span>
                </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden xl:block">
                    <p className="text-[0.6875rem] font-extrabold text-[#1E2B58] dark:text-white leading-none">
                        Dr. Alex Rivers
                    </p>
                    <p className="text-[0.5rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1">
                        Senior Lecturer
                    </p>
                </div>
                <img
                    alt="Dr. Alex Rivers Profile"
                    className="w-10 h-10 rounded-full bg-white/50 border-2 border-white shadow-sm object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzXuttG3iy6AOmS--FZFw64NpKFCoLUVOzqJ7BfgkAvr3mQ-26f6OTnJxbQLGIKix0NHo8wv8i2cdNaP1JhYr2GWNx2_Ut-AmXECWfKkn8opPTw2-HDc0UaDYEQR1xyn6F8z1HSyj6Op6CkzX8lfGuo48WunE-d4W0bqD3aXKmIzwgDeue06pjKryGyY8x0T4KCUGj2VQGLrPbNKHV3DlrZQpfbzH9rEzIsTX0PtsbQxU8KL-9xXoEaRac9zf7ww_qHSOwYRrya3jg"
                />
            </div>
        </div>
    );
};

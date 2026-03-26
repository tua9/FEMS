/**
 * NavBrand — Logo + Portal label bên trái navbar.
 * Dùng chung cho tất cả role.
 */
import React from "react";


const NavBrand = ({ portalLabel, brandIcon: _brandIcon }) => (
  <div className="flex min-w-40 items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-[#1E2B58] shadow-lg">
      <img src="/logo1.png" alt="F-EMS Logo" className="h-full w-full object-cover" />
    </div>
    <div>
      <h1 className="text-base font-extrabold leading-none tracking-tight text-[#1E2B58] dark:text-white">
        F-EMS
      </h1>
      <p className="mt-1 text-[8px] font-black tracking-[0.15em] text-[#1E2B58]/70 uppercase dark:text-slate-400">
        {portalLabel}
      </p>
    </div>
  </div>
);

export default NavBrand;

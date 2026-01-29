import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import NavbarBrand from './NavbarBrand';
import NavbarNavLinks from './NavbarNavLinks';
import NavbarRightActions from './NavbarRightActions';

interface NavLink {
  name: string;
  path: string;
}

const STUDENT_NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Equipment List', path: '/equipment' },
  { name: 'My History', path: '/history' },
  { name: 'Report Issue', path: '/report' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sau này: lấy từ prop role hoặc context để đổi links
  const navLinks = STUDENT_NAV_LINKS;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4">
      <nav className="max-w-7xl mx-auto glass-nav rounded-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        <NavbarBrand />
        <NavbarNavLinks links={navLinks} currentPath={location.pathname} />
        <div ref={dropdownRef}>
          <NavbarRightActions
            isDropdownOpen={isDropdownOpen}
            onToggleDropdown={() => setIsDropdownOpen(prev => !prev)}
            onCloseDropdown={() => setIsDropdownOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
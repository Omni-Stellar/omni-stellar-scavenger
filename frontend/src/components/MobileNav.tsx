import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Trash2, BarChart2, User, PlusCircle } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const MobileNav: React.FC = () => {
  const router = useRouter();
  
  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: <Home size={24} /> },
    { href: '/waste', label: 'Waste', icon: <Trash2 size={24} /> },
    { href: '/submit', label: 'Submit', icon: <PlusCircle size={24} /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart2 size={24} /> },
    { href: '/profile', label: 'Profile', icon: <User size={24} /> },
  ];

  return (
    <nav className="nav-mobile">
      {navItems.map((item) => {
        const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span style={{ fontSize: '10px', marginTop: '2px' }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

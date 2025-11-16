'use client';

import Link from 'next/link';
import {
  IconHome,
  IconMovie,
  IconCategory,
  IconInfoCircle,
} from "@tabler/icons-react";

export default function NavigationHeader() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: IconHome,
    },
    {
      name: "Movies",
      link: "/movies",
      icon: IconMovie,
    },
    {
      name: "Genres",
      link: "/genres",
      icon: IconCategory,
    },
    {
      name: "About",
      link: "/about",
      icon: IconInfoCircle,
    },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4 md:px-6">
      <div className="bg-gradient-to-r from-[#232323] via-[#343434] to-[#464646] rounded-full shadow-lg drop-shadow-lg border border-[#575757]/30">
        <div className="flex items-center justify-between h-14 px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white drop-shadow-lg">Movie</span>
            <span className="font-medium text-xl text-white drop-shadow-lg">Directory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className="flex items-center space-x-2 text-white hover:text-[#7a7a7a] transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-white hover:text-[#7a7a7a] transition-colors duration-200"
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

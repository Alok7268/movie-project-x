'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000814]/95 backdrop-blur-md border-b border-[#003566]/50 shadow-lg shadow-[#ffc300]/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-[#ffc300] transition-colors duration-300 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent">
              Movie Directory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#ffc300] transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-[#001d3d]/50"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-[#ffc300] transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-[#001d3d]/50"
            >
              Movies
            </Link>
            <Link
              href="/genres"
              className="text-gray-300 hover:text-[#ffc300] transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-[#001d3d]/50"
            >
              Genres
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-[#ffc300] transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-[#001d3d]/50"
            >
              About
            </Link>
            <button
              className="p-2.5 text-gray-300 hover:text-[#ffc300] hover:bg-[#001d3d]/50 transition-all duration-300 rounded-lg"
              aria-label="Search"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-[#ffc300] transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#003566]/50 bg-[#001d3d]/30 backdrop-blur-md rounded-lg">
            <div className="flex flex-col gap-2 pt-4 px-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-[#ffc300] hover:bg-[#001d3d]/50 transition-all duration-300 font-medium px-4 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="text-gray-300 hover:text-[#ffc300] hover:bg-[#001d3d]/50 transition-all duration-300 font-medium px-4 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/genres"
                className="text-gray-300 hover:text-[#ffc300] hover:bg-[#001d3d]/50 transition-all duration-300 font-medium px-4 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-[#ffc300] hover:bg-[#001d3d]/50 transition-all duration-300 font-medium px-4 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


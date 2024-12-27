'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { NAV_ITEMS } from '@/constants';

type Properties = {
  isSignedIn: boolean;
};

const Navbar: FC<Properties> = ({ isSignedIn }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = () => {
    router.push('/?search_page=1');
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 pt-1 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md backdrop-blur-md dark:bg-gray-900' : 'bg-transparent'}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div className="flex items-center" onClick={handleHomeClick}>
              <span className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:text-white">
                Crypto Monitor
              </span>
            </div>
          </div>

          <div className="hidden items-center sm:ml-6 sm:flex sm:space-x-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  className={`inline-flex items-center px-1 py-1 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-b-[1px] border-blue-500 pb-1.5 pt-1 text-blue-600 hover:pb-1.5'
                      : 'text-gray-500 hover:border-b-[1px] hover:border-gray-300 hover:pb-1.5 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100'
                  }`}
                  href={item.href}
                  key={item.name}
                >
                  <item.icon className="mr-1 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {isSignedIn ? <UserButton /> : <SignInButton />}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              aria-expanded={isOpen}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <span className="sr-only">Open main menu</span>

              {isOpen ? (
                <X aria-hidden="true" className="block h-6 w-6" />
              ) : (
                <Menu aria-hidden="true" className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-1 rounded-b-lg bg-white pb-3 pt-2 shadow-lg">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    className={`block py-2 pl-3 pr-4 text-base font-medium transition-colors duration-300 ${
                      isActive
                        ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:border-l-4 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    href={item.href}
                    key={item.name}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

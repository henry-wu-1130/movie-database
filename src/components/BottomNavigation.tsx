'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiBookmark } from 'react-icons/fi';
import clsx from 'clsx';

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      icon: FiHome,
      href: '/',
    },
    // {
    //   label: 'Search',
    //   icon: FiSearch,
    //   href: '/search',
    // },
    {
      label: 'Watchlist',
      icon: FiBookmark,
      href: '/watchlist',
    },
    // {
    //   label: 'Profile',
    //   icon: FiUser,
    //   href: '/profile',
    // },
  ];

  // Extract language from pathname
  const lng = pathname.split('/')[1];

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${lng}` || pathname === `/${lng}/`;
    }
    return pathname.startsWith(`/${lng}${href}`);
  };

  // Function to navigate with language prefix
  const navigateTo = (href: string) => {
    if (href === '/') {
      router.push(`/${lng}`);
    } else {
      router.push(`/${lng}${href}`);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 dark:bg-black border-t border-gray-700 flex justify-around items-center h-16 safe-area-bottom">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => navigateTo(item.href)}
          className={clsx(
            'flex flex-col items-center justify-center w-full h-full text-xs',
            isActive(item.href)
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          )}
          aria-label={item.label}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

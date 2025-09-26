'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
  UsersIcon,
  MegaphoneIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Marketing', href: '/marketing', icon: MegaphoneIcon },
];

const ownerOnlyNavigation = [
  { name: 'Staff', href: '/staff', icon: UsersIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileMenu({ open, setOpen }: MobileMenuProps) {
  const pathname = usePathname();
  const { profile, isOwner, signOut } = useAuth();

  const allNavigation = [
    ...navigation,
    ...(isOwner ? ownerOnlyNavigation : [])
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MB</span>
                  </div>
                  <span className="ml-2 text-lg font-bold text-gray-900">Multi Business</span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="mt-5 px-4 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                    <p className="text-xs text-gray-500 capitalize flex items-center">
                      {profile?.role}
                      {profile?.role === 'owner' && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Admin
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="mt-5 flex-1 space-y-1 px-2 overflow-y-auto">
                {allNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-4 flex-shrink-0 h-6 w-6',
                          isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Footer */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
                >
                  <svg
                    className="mr-4 h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0">{/* Dummy element to force sidebar to shrink to fit close icon */}</div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
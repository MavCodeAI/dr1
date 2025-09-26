'use client';

import React from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  CubeIcon,
  ShoppingCartIcon,
  MegaphoneIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { generateWhatsAppMessage } from '@/lib/utils';

interface QuickAction {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  onClick?: () => void;
}

const quickActions: QuickAction[] = [
  {
    name: 'New Order',
    href: '/orders/new',
    icon: ShoppingCartIcon,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Add Product',
    href: '/products/new',
    icon: CubeIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: MegaphoneIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

const shareActions = [
  {
    name: 'WhatsApp',
    onClick: () => {
      const message = generateWhatsAppMessage(
        'Premium Products',
        0,
        'Multi-Product Business'
      );
      window.open(message, '_blank');
    },
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'Share Catalog',
    onClick: () => {
      if (navigator.share) {
        navigator.share({
          title: 'Multi-Product Business',
          text: 'Check out our premium products: Shilajit, Dry Fruits, Honey & more!',
          url: window.location.origin,
        });
      } else {
        navigator.clipboard.writeText(window.location.origin);
        // Could add toast notification here
      }
    },
    color: 'bg-indigo-600 hover:bg-indigo-700',
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      {/* Main Quick Actions */}
      <div className="flex items-center space-x-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href || '#'}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${action.color}`}
            >
              <Icon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{action.name}</span>
              <span className="sm:hidden">{action.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Share Actions Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 group"
          onClick={(e) => {
            e.preventDefault();
            const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
            dropdown.classList.toggle('hidden');
          }}
        >
          <ShareIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Share</span>
        </button>
        
        <div className="hidden absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {shareActions.map((action) => (
              <button
                key={action.name}
                onClick={action.onClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {action.name}
              </button>
            ))}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  const message = `Check out our premium products!

🏔️ Premium Shilajit
🥜 Dry Fruits
🍯 Pure Honey
💊 Shilajit Drops

For orders & inquiries, contact us!

#Business #HealthyLiving #NaturalProducts`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                WhatsApp Promo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
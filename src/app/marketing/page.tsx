'use client';

import React, { useState } from 'react';
import {
  MegaphoneIcon,
  ShareIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatDate, generateWhatsAppMessage, cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CardSkeleton } from '@/components/ui/LoadingScreen';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface MarketingPost {
  id: string;
  platform: 'facebook' | 'linkedin' | 'whatsapp';
  title: string | null;
  content: string;
  image_url: string | null;
  status: 'scheduled' | 'posted' | 'failed';
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
}

function useMarketingPosts() {
  return useQuery({
    queryKey: ['marketing-posts'],
    queryFn: async (): Promise<MarketingPost[]> => {
      const { data, error } = await supabase
        .from('marketing_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export default function MarketingPage() {
  const { data: posts, isLoading, error } = useMarketingPosts();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredPosts = posts?.filter((post) => {
    return selectedPlatform === 'all' || post.platform === selectedPlatform;
  });

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'linkedin':
        return '💼';
      case 'whatsapp':
        return '💬';
      default:
        return '📢';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-blue-100 text-blue-900';
      case 'whatsapp':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shareOnWhatsApp = (content: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Center</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your social media campaigns and promotional content
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                const businessMessage = `🏔️ PREMIUM NATURAL PRODUCTS 🏔️

✨ PURE HIMALAYAN SHILAJIT
✅ Lab tested & authentic
✅ Rich in minerals & fulvic acid
✅ Multiple forms available

🌰 PREMIUM DRY FRUITS
✅ Kashmir almonds & walnuts
✅ Fresh & organic
✅ Perfect for gifting

🍯 PURE FOREST HONEY
✅ Raw & unprocessed
✅ Rich in enzymes
✅ Multiple varieties

For orders & inquiries:
📞 Contact us now!

#NaturalHealth #Shilajit #DryFruits #PureHoney #HealthyLiving`;
                shareOnWhatsApp(businessMessage);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="-ml-1 mr-2 h-5 w-5" />
              Share Catalog
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Post
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Share Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                const message = `🏔️ NEW ARRIVAL: Premium Himalayan Shilajit!

Authentic, lab-tested, and packed with minerals.
Experience the power of nature! ✨

#Shilajit #NaturalHealth #Wellness`;
                shareOnWhatsApp(message);
              }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center w-full">
                <div className="text-2xl mb-2">🏔️</div>
                <div className="text-sm font-medium text-gray-900">Shilajit Promo</div>
              </div>
            </button>

            <button
              onClick={() => {
                const message = `🌰 FRESH DRY FRUITS COLLECTION 🌰

• Kashmir Almonds
• Premium Walnuts  
• Mixed Dry Fruits

Perfect for healthy snacking & gifting! 🎁

#DryFruits #HealthySnacks #Kashmir`;
                shareOnWhatsApp(message);
              }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center w-full">
                <div className="text-2xl mb-2">🌰</div>
                <div className="text-sm font-medium text-gray-900">Dry Fruits</div>
              </div>
            </button>

            <button
              onClick={() => {
                const message = `🍯 PURE FOREST HONEY 🍯

Raw, unprocessed, and full of natural goodness!

✅ Rich in enzymes
✅ Natural antioxidants
✅ Multiple varieties

#PureHoney #Natural #Healthy`;
                shareOnWhatsApp(message);
              }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center w-full">
                <div className="text-2xl mb-2">🍯</div>
                <div className="text-sm font-medium text-gray-900">Honey</div>
              </div>
            </button>

            <button
              onClick={() => {
                const message = `🛍️ SPECIAL OFFERS AVAILABLE! 🛍️

Limited time deals on our premium products:

• Shilajit variants
• Dry fruits combo
• Pure honey collection

Don't miss out! Contact us today! 📞

#SpecialOffer #Sale #NaturalProducts`;
                shareOnWhatsApp(message);
              }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center w-full">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-sm font-medium text-gray-900">Special Offers</div>
              </div>
            </button>
          </div>
        </div>

        {/* Platform Filter */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <MegaphoneIcon className="h-5 w-5 text-gray-400" />
              <select
                className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="p-6">
            {filteredPosts && filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getPlatformColor(post.platform)
                          )}>
                            {post.platform}
                          </span>
                        </div>
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(post.status)
                        )}>
                          {post.status}
                        </span>
                      </div>
                      
                      {post.title && (
                        <h3 className="text-sm font-medium text-gray-900 mb-2 truncate">
                          {post.title}
                        </h3>
                      )}
                      
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          {post.scheduled_at ? (
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Scheduled: {formatDate(post.scheduled_at)}
                            </div>
                          ) : post.posted_at ? (
                            <div>Posted: {formatDate(post.posted_at)}</div>
                          ) : (
                            <div>Created: {formatDate(post.created_at)}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-500"
                            title="View post"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500"
                            title="Edit post"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-500"
                            title="Delete post"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {post.platform === 'whatsapp' && (
                          <button
                            onClick={() => shareOnWhatsApp(post.content)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <ShareIcon className="h-3 w-3 mr-1" />
                            Share Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No marketing posts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first marketing post to promote your products
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Create First Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
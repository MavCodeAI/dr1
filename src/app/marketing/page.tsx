'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  MegaphoneIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
=======
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
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626

interface MarketingPost {
  id: string;
  platform: 'facebook' | 'linkedin' | 'whatsapp';
<<<<<<< HEAD
  content: string;
  image_url?: string;
  status: 'scheduled' | 'posted' | 'failed';
  scheduled_at?: string;
  posted_at?: string;
}

export default function MarketingPage() {
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [newPost, setNewPost] = useState({
    platform: 'whatsapp' as const,
    content: '',
    image_url: '',
    scheduled_at: '',
  });

  useEffect(() => {
    // Mock data for now since we don't have marketing posts API
    const mockPosts: MarketingPost[] = [
      {
        id: '1',
        platform: 'whatsapp',
        content: 'Check out our premium Shilajit! Pure Himalayan quality. Contact us for orders.',
        status: 'posted',
        posted_at: new Date().toISOString(),
      },
      {
        id: '2',
        platform: 'facebook',
        content: 'New stock arrived! Fresh almonds and honey available now.',
        status: 'scheduled',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      },
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.content) return;

    const post: MarketingPost = {
      id: Date.now().toString(),
      ...newPost,
      status: 'scheduled',
    };

    setPosts([post, ...posts]);
    setNewPost({
      platform: 'whatsapp',
      content: '',
      image_url: '',
      scheduled_at: '',
    });
    setShowCreateForm(false);
  };

  const generateWhatsAppLink = (content: string) => {
    const encodedContent = encodeURIComponent(content);
    return `https://wa.me/?text=${encodedContent}`;
  };
=======
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
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'linkedin':
        return '💼';
      case 'whatsapp':
        return '💬';
      default:
<<<<<<< HEAD
        return '📱';
=======
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
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
<<<<<<< HEAD
        return 'text-green-600 bg-green-50 border-green-200';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'scheduled':
        return <ClockIcon className="w-4 h-4" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

=======
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

>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
<<<<<<< HEAD
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MegaphoneIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
              <p className="text-sm text-gray-500">Manage your social media posts and campaigns</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <PlusIcon className="w-4 h-4" />
            Create Post
          </button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h2>
            
            <div className="space-y-4">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write your post content..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newPost.image_url}
                  onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPost.scheduled_at}
                  onChange={(e) => setNewPost({ ...newPost, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Post
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <MegaphoneIcon className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="mt-2 text-gray-500">Create your first marketing post to get started.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <PlusIcon className="w-4 h-4" />
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{post.platform}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(post.status)}`}>
                          {getStatusIcon(post.status)}
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{post.content}</p>

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="w-32 h-32 object-cover rounded-md mb-4"
                      />
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {post.scheduled_at && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          Scheduled: {formatDate(post.scheduled_at)}
                        </div>
                      )}
                      {post.posted_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" />
                          Posted: {formatDate(post.posted_at)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {post.platform === 'whatsapp' && (
                      <a
                        href={generateWhatsAppLink(post.content)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        <ShareIcon className="w-3 h-3" />
                        Share
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Templates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'New Product Announcement',
                content: 'Exciting news! 🎉 We just received fresh stock of premium [PRODUCT NAME]. High quality, competitive prices. Contact us for bulk orders! 📞',
              },
              {
                title: 'Special Offer',
                content: '🔥 Limited time offer! Get [X]% discount on [PRODUCT NAME]. Valid until [DATE]. Don\'t miss out! Order now 📞',
              },
              {
                title: 'Customer Testimonial',
                content: '⭐ Another satisfied customer! "[TESTIMONIAL]" - [Customer Name]. Experience the quality yourself. Order today! 📞',
              },
              {
                title: 'Stock Alert',
                content: '⚡ Running low on [PRODUCT NAME]! Only few pieces left in stock. Order now to avoid disappointment! 📞',
              },
            ].map((template, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                <button
                  onClick={() => {
                    setNewPost({ ...newPost, content: template.content });
                    setShowCreateForm(true);
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Use Template
                </button>
              </div>
            ))}
=======
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
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
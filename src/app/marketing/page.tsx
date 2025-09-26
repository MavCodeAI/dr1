'use client';

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

interface MarketingPost {
  id: string;
  platform: 'facebook' | 'linkedin' | 'whatsapp';
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'linkedin':
        return '💼';
      case 'whatsapp':
        return '💬';
      default:
        return '📱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
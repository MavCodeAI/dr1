'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
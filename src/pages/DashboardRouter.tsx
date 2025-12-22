import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function DashboardRouterContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) return;

    // Route to role-specific dashboard
    switch (user.role) {
      case 'buyer':
        setLocation('/dashboard/buyer');
        break;
      case 'seller':
        setLocation('/dashboard/seller');
        break;
      case 'broker':
        setLocation('/dashboard/broker');
        break;
      case 'admin':
        setLocation('/admin');
        break;
      default:
        setLocation('/');
    }
  }, [user, setLocation]);

  return null;
}

export default function DashboardRouter() {
  return (
    <ProtectedRoute>
      <DashboardRouterContent />
    </ProtectedRoute>
  );
}

import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string[];
}

/**
 * ProtectedRoute component - Ensures user is authenticated before rendering children
 *
 * Features:
 * - Waits for auth state to load before making decisions
 * - Redirects to login if not authenticated
 * - Shows loading spinner during auth check
 * - Prevents flash of unauthenticated content
 * - Supports role-based access control
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requiredRole
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);

  useEffect(() => {
    // Mark that we've checked authentication at least once
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Only redirect after loading is complete, we've checked auth,
    // and user is not authenticated
    if (!isLoading && hasCheckedAuth && !isAuthenticated) {
      console.log('User not authenticated, redirecting to:', redirectTo);
      setLocation(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, setLocation, hasCheckedAuth]);

  // Check role-based access if required
  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && user) {
      if (!requiredRole.includes(user.role)) {
        console.log('User does not have required role, redirecting to home');
        setLocation('/');
      }
    }
  }, [isLoading, isAuthenticated, requiredRole, user, setLocation]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (prevents flash)
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return null;
  }

  // Render children only when authenticated
  return <>{children}</>;
}

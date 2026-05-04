'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in as admin
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    if (pathname !== '/admin/login') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
}

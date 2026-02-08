'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/src/services/api_client';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/auth/ProtectedRoute';

interface User {
  id: string;
  email: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/users/me');
        setUser(response.data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          // Token is invalid/expired, redirect to sign in
          router.push('/auth/signin');
        } else {
          setError('Failed to load profile information');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/signout');
      // Remove token from storage
      apiClient.clearToken();
      // Redirect to sign in page
      router.push('/auth/signin');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if the API call fails, still remove the token locally
      apiClient.clearToken();
      router.push('/auth/signin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {user ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <div className="mt-1 text-sm text-gray-900">{user.email}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
                  <div className="mt-1 text-sm text-gray-900">
                    {user.is_active ? 'Active' : 'Inactive'}
                    {user.email_verified ? ' | Verified' : ' | Unverified'}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                  <div className="mt-1 text-sm text-gray-900 font-mono">{user.id}</div>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Failed to load user profile</div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
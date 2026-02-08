'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to tasks page
    if (!loading && isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">TodoApp</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A modern, secure task management application with user authentication.
            Organize your tasks, track progress, and boost productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started - Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 transition duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600">
                JWT-based authentication with password strength validation and secure token management.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Task Management</h3>
              <p className="text-gray-600">
                Create, edit, complete, and delete tasks with priority levels and due dates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Isolation</h3>
              <p className="text-gray-600">
                Your tasks are private and secure. Each user only sees their own data.
              </p>
            </div>
          </div>

          <div className="mt-20 bg-white p-12 rounded-2xl shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">User Registration & Login</h4>
                  <p className="text-gray-600 text-sm">Secure account creation with email and password</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Task Organization</h4>
                  <p className="text-gray-600 text-sm">Organize tasks by priority and status</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Responsive Design</h4>
                  <p className="text-gray-600 text-sm">Works seamlessly on desktop, tablet, and mobile</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-2xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                  <p className="text-gray-600 text-sm">Instant UI updates when you modify tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

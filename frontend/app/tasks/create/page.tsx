'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/src/components/tasks/task-form';
import { ProtectedRoute } from '@/src/components/auth/ProtectedRoute';
import { Task } from '@/src/types/task';

export default function CreateTaskPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTaskCreated = (task: any) => {
    // Show success message
    setShowSuccess(true);

    // Redirect to tasks page after a short delay
    setTimeout(() => {
      router.push('/tasks');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create New Task</h1>
            <p className="text-gray-600 mt-2">Add a new task to your list</p>
          </div>

          {showSuccess && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">
                Task created successfully! Redirecting to task list...
              </div>
            </div>
          )}

          <TaskForm onTaskCreated={handleTaskCreated} onCancel={handleCancel} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
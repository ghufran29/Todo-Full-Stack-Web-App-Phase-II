'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/auth/ProtectedRoute';
import TaskService from '@/src/services/task_service';
import { Task } from '@/src/types/task';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedPriority, setEditedPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [editedDueDate, setEditedDueDate] = useState<string>('');

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await TaskService.getTaskById(taskId);
      setTask(taskData);
      setEditedTitle(taskData.title);
      setEditedDescription(taskData.description || '');
      setEditedPriority(taskData.priority || 'medium');
      setEditedDueDate(taskData.due_date || '');
    } catch (err: any) {
      console.error('Error fetching task:', err);
      setError(err.response?.data?.detail || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!task || !task.id) return;

    try {
      setError(null);
      const updatedTask = await TaskService.updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        due_date: editedDueDate || null,
      });
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.detail || 'Failed to update task');
    }
  };

  const handleToggleComplete = async () => {
    if (!task || !task.id) return;

    try {
      setError(null);
      const completed = task.status !== 'completed';
      const updatedTask = await TaskService.updateTaskCompletion(task.id, completed);
      setTask(updatedTask);
    } catch (err: any) {
      console.error('Error updating task completion:', err);
      setError(err.response?.data?.detail || 'Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (!task || !task.id) return;

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setError(null);
      await TaskService.deleteTask(task.id);
      router.push('/tasks');
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.detail || 'Failed to delete task');
    }
  };

  const handleCancel = () => {
    if (!task) return;
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedPriority(task.priority || 'medium');
    setEditedDueDate(task.due_date || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !task) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error || 'Task not found'}</div>
            </div>
            <button
              onClick={() => router.push('/tasks')}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              ← Back to tasks
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => router.push('/tasks')}
              className="text-indigo-600 hover:text-indigo-800 mb-4"
            >
              ← Back to tasks
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Task Details</h1>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editedPriority}
                      onChange={(e) => setEditedPriority(e.target.value as any)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-2xl font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h2>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status?.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                )}

                {task.due_date && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                    <p className="text-gray-600">{new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Timestamps</h3>
                  {task.created_at && (
                    <p className="text-sm text-gray-500">
                      Created: {new Date(task.created_at).toLocaleString()}
                    </p>
                  )}
                  {task.updated_at && (
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(task.updated_at).toLocaleString()}
                    </p>
                  )}
                  {task.completed_at && (
                    <p className="text-sm text-gray-500">
                      Completed: {new Date(task.completed_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={handleToggleComplete}
                    className={`${
                      task.status === 'completed'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white py-2 px-4 rounded-md`}
                  >
                    {task.status === 'completed' ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
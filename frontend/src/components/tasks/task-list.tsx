'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../../types/task';
import TaskItem from './task-item';
import TaskForm from './task-form';
import { apiClient } from '../../services/api_client';
import { useAuth } from '../../hooks/useAuth';

interface TaskListProps {
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskUpdate, onTaskDelete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/tasks');
      setTasks(response.data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      // If 404, it might just mean no tasks found endpoint or empty list, depending on backend implementation. 
      // Safest to just show empty list if strictly 404 on list endpoint is the behavior, 
      // but usually list endpoints return 200 [] for empty.
      // However, keeping robust error handling is good.
      if (err.response?.status === 404) {
         setTasks([]); // Treat 404 as no tasks
      } else {
         setError(err.response?.data?.detail || 'Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: any) => {
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    try {
      // Only call API if it's a full update from TaskItem (not just a toggle)
      // Actually, it's safer to always sync if we have the ID
      if (updatedTask.id) {
        const response = await apiClient.updateTask(updatedTask.id, {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          due_date: updatedTask.due_date
        });
        setTasks(prev => prev.map(task => task.id === response.id ? response : task));
        if (onTaskUpdate) onTaskUpdate(response);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to save task changes');
    }
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      if (onTaskDelete) onTaskDelete(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      if (!task.id) return;
      const isCompleted = task.status === 'completed';
      const response = await apiClient.completeTask(task.id, !isCompleted);

      handleTaskUpdated(response);
    } catch (err: any) {
      console.error('Error updating task completion:', err);
      setError('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleTaskUpdated}
              onDelete={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
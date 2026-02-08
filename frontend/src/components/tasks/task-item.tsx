'use client';

import React, { useState } from 'react';
import { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(task.title);
  const [editedDescription, setEditedDescription] = useState<string>(task.description || '');
  const [editedPriority, setEditedPriority] = useState<string>(task.priority || 'medium');
  const [editedDueDate, setEditedDueDate] = useState<string>(task.due_date || '');

  const handleSave = () => {
    // Create updated task object
    const updatedTask: Task = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as 'low' | 'medium' | 'high' | 'urgent',
      due_date: editedDueDate || null,
      updated_at: new Date().toISOString(),
    };

    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedPriority(task.priority || 'medium');
    setEditedDueDate(task.due_date || '');
    setIsEditing(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${task.status === 'completed' ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded-md text-lg font-medium"
            placeholder="Task title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Task description"
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent Priority</option>
            </select>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 ease-in-out"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => onToggleComplete(task)}
                className="h-5 w-5 text-indigo-600 rounded mr-3"
              />
              <div>
                <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status || 'pending')}`}>
                {task.status?.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority || 'medium')}`}>
                {task.priority?.toUpperCase()}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800 ml-2"
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={() => task.id && onDelete(task.id)}
                className="text-red-600 hover:text-red-800 ml-2"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
          {task.due_date && (
            <div className="mt-2 text-sm text-gray-500">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
          {task.created_at && (
            <div className="mt-1 text-xs text-gray-400">
              Created: {new Date(task.created_at).toLocaleString()}
            </div>
          )}
          {task.updated_at && (
            <div className="mt-1 text-xs text-gray-400">
              Updated: {new Date(task.updated_at).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
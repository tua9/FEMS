import { Task, TaskStats, UpdateTaskPayload } from '@/types/technician.types';

const API_BASE = '/api/technician';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const technicianApi = {
  // Get all tasks assigned to technician
  getTasks: async (filters?: { status?: string; priority?: string }): Promise<Task[]> => {
    const params = new URLSearchParams(filters as Record<string, string>);
    const response = await fetch(`${API_BASE}/tasks?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch tasks (${response.status})`);
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server (expected JSON)');
    }
    if (!Array.isArray(data)) throw new Error('Unexpected response format for tasks');
    return data as Task[];
  },

  // Get task statistics
  getStats: async (): Promise<TaskStats> => {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch stats (${response.status})`);
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server (expected JSON)');
    }
    return data as TaskStats;
  },

  // Get single task details
  getTaskById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch task (${response.status})`);
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server (expected JSON)');
    }
    return data as Task;
  },

  // Update task status/notes
  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const formData = new FormData();
    
    if (payload.status) formData.append('status', payload.status);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.images) {
      payload.images.forEach(image => formData.append('images', image));
    }

    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  // Accept task assignment
  acceptTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to accept task');
    return response.json();
  },

  // Complete task
  completeTask: async (id: string, notes: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!response.ok) throw new Error('Failed to complete task');
    return response.json();
  },
};
// src/services/todoService.ts
import api from './api';
import type { TodoItem } from '../types';

export const todoService = {
  getAll: async (userId: number): Promise<TodoItem[]> => {
    const response = await api.get<TodoItem[]>('/todos', {
      params: { userId },
    });
    return response.data;
  },

  create: async (title: string, ownerId: number): Promise<TodoItem> => {
    const response = await api.post<TodoItem>('/todos', {
      title,
      isDone: false,
      ownerId,
    });
    return response.data;
  },

  update: async (todo: TodoItem): Promise<void> => {
    await api.put(`/todos/${todo.id}`, todo);
  },

  toggleStatus: async (todo: TodoItem): Promise<void> => {
    await api.put(`/todos/${todo.id}`, {
      ...todo,
      isDone: !todo.isDone, 
    });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};
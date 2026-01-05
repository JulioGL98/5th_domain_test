// src/types/index.ts

export interface User {
  id: number;
  username: string;
  role: 'User' | 'Premium' | 'Admin';
}

export interface TodoItem {
  id: number;
  title: string;
  isDone: boolean;
  ownerId: number;
  createdAt: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  role: 'User' | 'Premium' | 'Admin';
}
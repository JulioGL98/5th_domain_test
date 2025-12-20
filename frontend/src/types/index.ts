// src/types/index.ts

export interface User {
  id: number;
  username: string;
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
}
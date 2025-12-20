// src/services/authService.ts
import api from './api';
import type { LoginResponse } from '../types';
export const authService = {
  // login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  },
  // register
  register: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', {
      username,
      password,
    });
    return response.data;
  },
};
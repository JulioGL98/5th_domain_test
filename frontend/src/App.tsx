// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { TodosPage } from './pages/TodosPage';
import { useAuth } from './context/AuthContext';
import { RegisterPage } from './pages/RegisterPage';

import type { ReactElement } from 'react';
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />      
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/todos" 
          element={
            <PrivateRoute>
              <TodosPage />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
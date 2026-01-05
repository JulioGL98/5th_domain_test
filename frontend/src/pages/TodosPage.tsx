// src/pages/TodosPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import type { TodoItem } from '../types';

export const TodosPage = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Loading state for bulk actions
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    try {
      const data = await todoService.getAll(user.id);
      setTodos(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Computed values
  const completedCount = todos.filter(t => t.isDone).length;
  const pendingCount = todos.filter(t => !t.isDone).length;
  const allCompleted = todos.length > 0 && todos.every(t => t.isDone);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    try {
      const createdTodo = await todoService.create(newTodo, user.id);
      setTodos([...todos, createdTodo]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (updatedTodo: TodoItem) => {
    try {
      await todoService.update(updatedTodo);

      setTodos(todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));

      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await todoService.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle all tasks
  const handleToggleAll = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (allCompleted) {
        await todoService.uncompleteAll(user.id);
      } else {
        await todoService.completeAll(user.id);
      }
      await loadTodos();
    } catch (error) {
      console.error('Error toggling all tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  //Delete all completed tasks
  const handleDeleteCompleted = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) return;

    setLoading(true);

    try {
      await todoService.deleteCompleted(user.id);
      await loadTodos();
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">My Tasks</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user?.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto mt-8 p-4">
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input
            type="text"
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Add a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md transition"
          >
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleToggleAll}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              {allCompleted ? `Uncheck All (${todos.length})` : `Check All (${pendingCount})`}
            </button>

            <button
              onClick={handleDeleteCompleted}
              disabled={loading || completedCount === 0}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 shadow-sm transition disabled:opacity-50"
            >
              Delete Completed ({completedCount})
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left w-16">Status</th>
                <th className="p-4 text-left">Task</th>
                <th className="p-4 text-left w-40">Created at</th>
                <th className="p-4 text-right w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    No new tasks.
                  </td>
                </tr>
              ) : (
                todos.map((todo) => {
                  const isEditing = editingId === todo.id;

                  return (
                    <tr key={todo.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={todo.isDone}
                          onChange={() => handleUpdate({ ...todo, isDone: !todo.isDone })}
                          className="w-5 h-5 text-blue-600 cursor-pointer"
                          disabled={isEditing}
                        />
                      </td>

                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdate({ ...todo, title: editTitle });
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className={`${todo.isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {todo.title}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-sm text-gray-500">
                        {formatDate(todo.createdAt)}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdate({ ...todo, title: editTitle })}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(todo)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(todo.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
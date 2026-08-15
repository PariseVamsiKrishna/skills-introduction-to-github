import { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { authApi, taskApi } from './services/api';

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveSession = (sessionToken, sessionUser) => {
    setToken(sessionToken);
    setUser(sessionUser);
    localStorage.setItem('token', sessionToken);
    localStorage.setItem('user', JSON.stringify(sessionUser));
  };

  const clearSession = () => {
    setToken('');
    setUser(null);
    setTasks([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (!token) {
        return;
      }

      try {
        const list = await taskApi.getAll(token);
        setTasks(list);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadTasks();
  }, [token]);

  const handleAuth = async (handler, payload) => {
    setLoading(true);
    setError('');

    try {
      const response = await handler(payload);
      saveSession(response.token, response.user);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (payload) => {
    try {
      setError('');
      const task = await taskApi.create(token, payload);
      setTasks((current) => [task, ...current]);
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleUpdateTask = async (taskId, payload) => {
    try {
      setError('');
      const task = await taskApi.update(token, taskId, payload);
      setTasks((current) => current.map((item) => (item._id === task._id ? task : item)));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError('');
      await taskApi.remove(token, taskId);
      setTasks((current) => current.filter((item) => item._id !== taskId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      {error ? <p className="error global-error">{error}</p> : null}
      {!token ? (
        authMode === 'login' ? (
          <Login
            onSubmit={(payload) => handleAuth(authApi.login, payload)}
            onSwitch={() => setAuthMode('register')}
            loading={loading}
            error={error}
          />
        ) : (
          <Register
            onSubmit={(payload) => handleAuth(authApi.register, payload)}
            onSwitch={() => setAuthMode('login')}
            loading={loading}
            error={error}
          />
        )
      ) : (
        <Dashboard
          user={user}
          tasks={tasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onLogout={clearSession}
        />
      )}
    </main>
  );
}

export default App;

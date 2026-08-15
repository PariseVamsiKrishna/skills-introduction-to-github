const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
};

const tokenHeader = (token) => ({ Authorization: `Token ${token}` });

export const authApi = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const taskApi = {
  getAll: (token) =>
    request('/tasks', {
      method: 'GET',
      headers: tokenHeader(token),
    }),
  create: (token, payload) =>
    request('/tasks', {
      method: 'POST',
      headers: tokenHeader(token),
      body: JSON.stringify(payload),
    }),
  update: (token, taskId, payload) =>
    request(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: tokenHeader(token),
      body: JSON.stringify(payload),
    }),
  remove: (token, taskId) =>
    request(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: tokenHeader(token),
    }),
};

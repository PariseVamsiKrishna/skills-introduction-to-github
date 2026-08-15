import { useState } from 'react';

function Login({ onSubmit, onSwitch, loading, error }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p>
        New here?{' '}
        <button type="button" className="link-button" onClick={onSwitch}>
          Create an account
        </button>
      </p>
    </div>
  );
}

export default Login;

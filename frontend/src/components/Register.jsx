import { useState } from 'react';

function Register({ onSubmit, onSwitch, loading, error }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          minLength="6"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <button type="button" className="link-button" onClick={onSwitch}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;

import { useMemo, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const FILTERS = ['All', 'Active', 'Completed'];

function Dashboard({ user, tasks, onCreateTask, onUpdateTask, onDeleteTask, onLogout }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Active') {
      return tasks.filter((task) => !task.completed);
    }
    if (activeFilter === 'Completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [activeFilter, tasks]);

  const handleSubmit = (payload) => {
    if (editingTask) {
      onUpdateTask(editingTask._id, payload);
      setEditingTask(null);
      return;
    }

    onCreateTask(payload);
  };

  return (
    <div className="dashboard">
      <header className="card header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Logout
        </button>
      </header>

      <TaskForm onSubmit={handleSubmit} editingTask={editingTask} onCancelEdit={() => setEditingTask(null)} />

      <section className="card">
        <h2>Tasks</h2>
        <div className="button-row filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? 'active-filter' : 'secondary'}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <TaskList
        tasks={filteredTasks}
        onToggleComplete={(task) => onUpdateTask(task._id, { completed: !task.completed })}
        onEdit={setEditingTask}
        onDelete={onDeleteTask}
      />
    </div>
  );
}

export default Dashboard;

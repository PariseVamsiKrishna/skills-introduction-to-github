import { useEffect, useState } from 'react';

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      return;
    }

    setTitle('');
    setDescription('');
  }, [editingTask]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, description });

    if (!editingTask) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <textarea
        rows="3"
        placeholder="Task description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="button-row">
        <button type="submit">{editingTask ? 'Update' : 'Add task'}</button>
        {editingTask ? (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TaskForm;

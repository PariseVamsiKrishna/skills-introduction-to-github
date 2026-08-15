function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="card">No tasks found for this filter.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="card task-item">
          <div>
            <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
            {task.description ? <p>{task.description}</p> : null}
          </div>
          <div className="button-row">
            <button type="button" className="secondary" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => onToggleComplete(task)}
            >
              {task.completed ? 'Mark active' : 'Complete'}
            </button>
            <button type="button" className="danger" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;

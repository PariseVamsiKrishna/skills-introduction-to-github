const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

jest.mock('../src/models/Task');

const authHeader = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return `Token ${token}`;
};

describe('Task API', () => {
  const userOneId = 'user-1';
  const userTwoId = 'user-2';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  it('creates, updates, lists and deletes own tasks', async () => {
    const createdTask = {
      _id: 'task-1',
      title: 'Learn testing',
      description: 'Write task API tests',
      completed: false,
      owner: userOneId,
    };

    Task.create.mockResolvedValue(createdTask);
    Task.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([createdTask]),
    });
    Task.findOneAndUpdate.mockResolvedValue({ ...createdTask, completed: true });
    Task.findOneAndDelete.mockResolvedValue(createdTask);

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', authHeader(userOneId))
      .send({ title: 'Learn testing', description: 'Write task API tests' });

    expect(createResponse.statusCode).toBe(201);

    const updateResponse = await request(app)
      .put('/api/tasks/task-1')
      .set('Authorization', authHeader(userOneId))
      .send({ completed: true });

    expect(updateResponse.statusCode).toBe(200);
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'task-1', owner: userOneId },
      { completed: true },
      { new: true, runValidators: true }
    );

    const listResponse = await request(app)
      .get('/api/tasks')
      .set('Authorization', authHeader(userOneId));

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const deleteResponse = await request(app)
      .delete('/api/tasks/task-1')
      .set('Authorization', authHeader(userOneId));

    expect(deleteResponse.statusCode).toBe(204);
    expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: 'task-1', owner: userOneId });
  });

  it('does not allow access to another user tasks', async () => {
    const ownedTask = {
      _id: 'task-1',
      title: 'Private task',
      completed: false,
      owner: userOneId,
    };

    Task.create.mockResolvedValue(ownedTask);
    Task.find.mockImplementation(({ owner }) => ({
      sort: jest.fn().mockResolvedValue(owner === userTwoId ? [] : [ownedTask]),
    }));
    Task.findOneAndUpdate.mockResolvedValue(null);

    await request(app)
      .post('/api/tasks')
      .set('Authorization', authHeader(userOneId))
      .send({ title: 'Private task' });

    const userTwoTasks = await request(app)
      .get('/api/tasks')
      .set('Authorization', authHeader(userTwoId));

    expect(userTwoTasks.statusCode).toBe(200);
    expect(userTwoTasks.body).toEqual([]);

    const forbiddenUpdate = await request(app)
      .put('/api/tasks/task-1')
      .set('Authorization', authHeader(userTwoId))
      .send({ completed: true });

    expect(forbiddenUpdate.statusCode).toBe(404);
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'task-1', owner: userTwoId },
      { completed: true },
      { new: true, runValidators: true }
    );
  });
});

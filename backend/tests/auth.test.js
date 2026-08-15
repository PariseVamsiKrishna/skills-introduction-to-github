const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

jest.mock('../src/models/User');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  it('registers a user', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('logs in an existing user', async () => {
    User.findOne.mockResolvedValue({
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.name).toBe('Test User');
  });
});

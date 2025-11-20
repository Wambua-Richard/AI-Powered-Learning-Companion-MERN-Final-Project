// Jest test suite for user registration and login functionality
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; // ensure your express app is exported from src/app.js
import User from '../src/models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectTestDB, disconnectTestDB, clearDB } from "./setup.js";

let mongod, token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await connectTestDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  await disconnectTestDB();
});

afterEach(async () => {
  await User.deleteMany({});
  await clearDB();
});

describe('Auth: Register / Login', () => {
  test('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('_id');
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
  });

  test('logs in an existing user', async () => {
    // create user directly
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('fails login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
  });
  test("User login returns JWT token", async () => {
    // register first
    await request(app).post("/api/auth/register").send({
      name: "Tester",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "login@example.com",
      password: "password123",
    });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("token");

  token = res.body.token;
  });
});

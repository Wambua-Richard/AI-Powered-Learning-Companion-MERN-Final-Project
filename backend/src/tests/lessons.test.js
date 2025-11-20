// Tests for Lessons API endpoints using Jest and Supertest
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../src/models/User.js';
import Lesson from '../src/models/Lesson.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectTestDB, disconnectTestDB, clearDB } from "./setup.js";

let mongod, token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await connectTestDB();

  // create user and get token
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Teacher', email: 'teach@example.com', password: 'password123' });

  token = reg.body.token;

  const login = await request(app)
    .post("/api/auth/login")
    .send({
        email: "teacher@example.com",
        password: "password123",
      });
  token = login.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  await disconnectTestDB();
});

afterEach(async () => {
  await Lesson.deleteMany({});
  await clearDB();
});

describe('Lessons API', () => {
  test('creates a lesson (protected route)', async () => {
    const res = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Photosynthesis', content: 'Process of photosynthesis...' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Photosynthesis');
  });

  test('gets lessons list', async () => {
    await Lesson.create({ title: 'Sample', content: 'x' });
    const res = await request(app)
      .get('/api/lessons');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

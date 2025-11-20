// AI Endpoints Tests
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import * as aiService from '../src/services/ai.service.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectTestDB, disconnectTestDB, clearDB } from "./setup.js";

let mongod, token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await connectTestDB();

  const reg = await request(app).post('/api/auth/register')
    .send({ name: 'User', email: 'user@example.com', password: 'password123' });

  token = reg.body.token;

  const login = await request(app).post("/api/auth/login").send({
    email: "ai@example.com",
    password: "password123",
  });

  token = login.body.token;

  // mock ai service
  jest.spyOn(aiService, 'generateQuiz').mockImplementation(async (topic, n = 5) => {
    return {
      title: `Mock Quiz on ${topic}`,
      questions: Array.from({ length: n }).map((_, i) => ({
        question: `Mock question ${i+1} for ${topic}`,
        options: ['A','B','C','D'],
        correctIndex: 0,
        explanation: 'Because.'
      }))
    };
  });

  jest.spyOn(aiService, 'explainTopic').mockImplementation(async (prompt) => {
    return `Mock explanation for ${prompt}`;
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  await disconnectTestDB();
});

afterEach(async () => {
    await clearDB();
  });

describe('AI endpoints', () => {
  test('generate quiz via AI', async () => {
    const res = await request(app)
      .post('/api/ai/generate-quiz')
      .set('Authorization', `Bearer ${token}`)
      .send({ topic: 'Photosynthesis', numQuestions: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('questions');
    expect(res.body.questions).toHaveLength(3);
  });

  test('explain via AI', async () => {
    const res = await request(app)
      .post('/api/ai/explain')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'What is photosynthesis?' });

    expect(res.statusCode).toBe(200);
    expect(res.body.explanation).toContain('Mock explanation');
  });
});

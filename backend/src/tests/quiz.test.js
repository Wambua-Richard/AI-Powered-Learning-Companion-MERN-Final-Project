// This is a sample test file for testing quiz submission functionality
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Quiz from '../src/models/Quiz.js';
import { connectTestDB, disconnectTestDB, clearDB } from "./setup.js";

let mongod, token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await connectTestDB();

  const reg = await request(app).post('/api/auth/register')
    .send({ name: 'Student', email: 'stud@example.com', password: 'password123' });

  token = reg.body.token;

  const login = await request(app).post("/api/auth/login").send({
    email: "quiz@example.com",
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
  await Quiz.deleteMany({});
  await clearDB();
});

describe('Quiz API', () => {
  
  test("Generate quiz (mocked)", async () => {
    // mock AI response if needed
    const res = await request(app)
      .post("/api/quiz/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ topic: "Photosynthesis" });
  
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
  });

  test('submit quiz results', async () => {
    // create quiz directly in DB
    const quiz = await Quiz.create({
      title: 'Sample Quiz',
      questions: [{ question: '1+1?', options: ['1','2'], correctAnswer: '2' }],
    });

    const res = await request(app)
      .post(`/api/quiz/${quiz._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: ['2'] });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('score');
  });
});

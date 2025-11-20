import { generateToken } from './generateToken.js';
import jwt from 'jsonwebtoken';

test('generateToken returns valid JWT', () => {
  const token = generateToken('user123');
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
  expect(decoded.id).toBe('user123');
});

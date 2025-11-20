import jwt from 'jsonwebtoken';

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '7d' });
}

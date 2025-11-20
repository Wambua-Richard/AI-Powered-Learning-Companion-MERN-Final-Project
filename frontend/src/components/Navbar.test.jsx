import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar.jsx';
import { BrowserRouter } from 'react-router-dom';

test('renders app title', () => {
  render(<BrowserRouter><Navbar /></BrowserRouter>);
  expect(screen.getByText(/AI Learning Companion/i)).toBeInTheDocument();
});

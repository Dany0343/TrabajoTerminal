import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from '../app/auth/register/page';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Prueba en RegisterPage.test.js
test('RegisterPage se renderiza correctamente', () => {
    expect(() => render(<RegisterPage />)).not.toThrow();
  });
  
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../app/auth/login/page';
import { signIn } from 'next-auth/react';
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

// Prueba en LoginPage.test.js
test('LoginPage se renderiza correctamente', () => {
    expect(() => render(<LoginPage />)).not.toThrow();
  });
  
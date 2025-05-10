import React from 'react';
// src/setupTests.js
import '@testing-library/jest-dom';

// Mock axios to bypass actual ESM import
jest.mock('axios');

// Mock react-router-dom for tests
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const React = require('react');
  return {
    ...actual,
    MemoryRouter: actual.MemoryRouter,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: {} }),
    Link: ({ to, children }) => React.createElement('a', { href: to }, children),
  };
});
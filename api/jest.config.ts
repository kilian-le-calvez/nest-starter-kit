export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@user/(.*)$': '<rootDir>/src/user/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@prisma-api/(.*)$': '<rootDir>/src/prisma/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
};

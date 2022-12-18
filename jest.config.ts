import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src'],
  testRegex: '/tests/.*.test.ts$',
  verbose: true,
};

export default config;

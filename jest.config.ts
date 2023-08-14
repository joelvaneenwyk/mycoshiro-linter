// jest.config.ts
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  // testEnvironment: "node",
  verbose: true,
  // automock: true,
  transformIgnorePatterns: [
    '"/node_modules/(?!unified-lint-rule)',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/__tests__/common.ts',
  ],
};
export default config;

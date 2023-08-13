//
// jest.config.ts
//

import { Config } from '@jest/types';

process.env.TZ = 'UTC'; // eslint-disable-line no-undef

// Sync object
export default async (): Promise<Config.InitialOptions> => {
    return {
        transformIgnorePatterns: [
            '"/node_modules/(?!unified-lint-rule)',
        ],
        testMatch: [
            '**/__tests__/**/*.[jt]s?(x)',
            '**/?(*.)+(spec|test).[jt]s?(x)',
            '!**/__tests__/common.ts',
        ]
    };
}

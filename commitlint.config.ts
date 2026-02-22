import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.startsWith('chore: bump')], // Ignore dependabot commits
  rules: {
    'body-max-line-length': [2, 'always', 150],
  },
};

export default Configuration;

import tailwind from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

export default [
  ...tailwind.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist',
      'src/components/ui',
      'src/components/{mode-toggle.tsx,theme-provider.tsx}',
      'tailwind.config.js',
    ],
  },
];

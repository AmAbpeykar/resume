import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import hooks from 'eslint-plugin-react-hooks';
import typescript from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
  js.configs.recommended,
  ...typescript.configs.recommended,
  { files: ['**/*.{ts,tsx}'], extends: [next.configs['core-web-vitals'], hooks.configs.flat.recommended] },
]);

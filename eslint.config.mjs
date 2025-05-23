import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'warn', // доступ к полям с any или unknown
      '@typescript-eslint/no-unsafe-assignment': 'warn', // присваивание any или unknown
      '@typescript-eslint/no-explicit-any': 'warn', // использование типа any
      '@typescript-eslint/no-unsafe-call': 'warn', // вызов any функций
      '@typescript-eslint/require-await': 'warn', // async без await
      '@typescript-eslint/no-floating-promises': 'warn', // необработанные Promises
      '@typescript-eslint/no-unsafe-argument': 'warn', // any аргументы
      '@typescript-eslint/unbound-method': 'warn', // передача метода без this
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto', // автоматическое определение окончаний строк
        },
      ],
    },
  },
);

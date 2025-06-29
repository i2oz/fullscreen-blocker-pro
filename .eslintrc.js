module.exports = {
    env: {
      browser: true,
      es2021: true,
      webextensions: true
    },
    extends: [
      'eslint:recommended',
      'prettier'
    ],
    plugins: [
      'prettier'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    globals: {
      chrome: 'readonly',
      browser: 'readonly'
    },
    rules: {
      // Code quality
      'no-console': 'off', // Allow console for debugging
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-duplicate-imports': 'error',
      
      // Best practices
      'eqeqeq': 'error',
      'curly': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // Style (handled by Prettier)
      'prettier/prettier': 'error',
      
      // Chrome extension specific
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: 'Use chrome.storage.local instead of localStorage in extensions'
        },
        {
          name: 'sessionStorage',
          message: 'Use chrome.storage.session instead of sessionStorage in extensions'
        }
      ],
      
      // Security
      'no-innerHTML': 'off', // We'll handle this manually where needed
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error'
    },
    overrides: [
      {
        // Background script
        files: ['background.js'],
        env: {
          serviceworker: true
        },
        globals: {
          chrome: 'readonly'
        }
      },
      {
        // Content scripts
        files: ['content.js', 'injected.js'],
        env: {
          browser: true
        },
        globals: {
          chrome: 'readonly',
          window: 'readonly',
          document: 'readonly'
        }
      },
      {
        // Popup scripts
        files: ['popup.js', 'i18n.js'],
        env: {
          browser: true
        },
        globals: {
          chrome: 'readonly',
          window: 'readonly',
          document: 'readonly',
          getMessage: 'readonly',
          getCurrentLocale: 'readonly'
        }
      },
      {
        // Development scripts
        files: ['scripts/**/*.js'],
        env: {
          node: true
        },
        rules: {
          'no-console': 'off'
        }
      }
    ]
  };
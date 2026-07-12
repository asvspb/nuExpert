module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This dependency is part of a circular relationship.',
      from: {},
      to: { circular: true }
    },
    {
      name: 'server-no-app-imports',
      severity: 'error',
      comment: 'Server logic must not import from frontend (app/) code.',
      from: { path: '^server' },
      to: { path: '^app' }
    },
    {
      name: 'app-no-server-imports',
      severity: 'error',
      comment: 'Frontend (app/) must not import from server logic (except types from shared/).',
      from: { path: '^app' },
      to: { path: '^server' }
    }
  ],
  options: {
    includeOnly: '^(app|server|shared)',
    exclude: '^\\.nuxt|^\\.output|^node_modules',
    tsConfig: {
      fileName: 'tsconfig.json'
    }
  }
}

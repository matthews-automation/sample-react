const path = require('path');

module.exports = {
  apps: [
    {
      name: 'MatthewsWebsite',
      exec_mode: 'cluster',
      instances: '1',
      cwd: path.resolve(__dirname),
      script: "npm",
      args: 'start',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '400M',
    }
  ]
}

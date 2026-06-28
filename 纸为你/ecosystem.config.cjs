module.exports = {
  apps: [
    {
      name: 'zhiweini-mobile',
      script: 'node',
      args: 'node_modules/vite/bin/vite.js',
      cwd: 'C:\\Users\\liyin\\Desktop\\xiangmu\\纸为你',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development'
      },
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 5000
    }
  ]
};

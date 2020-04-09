module.exports = {
  apps: [
    {
      name: 'KN',
      script: './host/bin/www',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      node_args: ['--harmony', '--inspect'],
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2.log',
      pid_file: './logs/pm2.pid',
      log_date_format: '',
      merge_logs: true,
      next_gen_js: true,
      max_restarts: 2,
      min_uptime: '10s',
      watch: ['api', 'host', 'shared', 'web'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        NODE_OPTIONS: '--inspect',
      },
    },
  ],
}

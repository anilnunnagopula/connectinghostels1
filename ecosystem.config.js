/**
 * PM2 Ecosystem Configuration
 *
 * Usage:
 *   pm2 start ecosystem.config.js                    # dev
 *   pm2 start ecosystem.config.js --env production   # prod
 *   pm2 stop connectinghostels-api
 *   pm2 reload connectinghostels-api                 # zero-downtime reload
 *   pm2 logs connectinghostels-api
 *   pm2 monit
 */
module.exports = {
  apps: [
    {
      name: "connectinghostels-api",
      script: "index.js",
      cwd: "./server",

      // Cluster mode: one process per CPU core — handles multi-core properly
      instances: "max",
      exec_mode: "cluster",

      // Keep alive: restart on crash
      max_restarts: 10,
      restart_delay: 3000,
      min_uptime: "10s",

      // Auto-restart if memory bloats past 512MB
      max_memory_restart: "512M",

      // Watch (disabled in prod — use PM2 reload for deploys)
      watch: false,

      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // Logging
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};

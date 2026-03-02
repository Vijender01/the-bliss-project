module.exports = {
  apps: [
    {
      name: "food-bliss-backend",
      script: "./backend/src/server.js",
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 3000,
      max_restarts: 10,
      watch: false,
      autorestart: true,
    },
    {
      name: "food-bliss-frontend-relay",
      script: "serve-spa.js",
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 2000,
      autorestart: true,
    }
  ],
};

module.exports = {
  apps: [{
    name: "foodbliss-api",
    script: "./src/server.js",
    cwd: "c:/Users/vijen/.gemini/antigravity/scratch/the-bliss-project/backend",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    watch: false,
    max_memory_restart: "300M",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    time: true
  }]
};

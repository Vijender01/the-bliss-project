module.exports = {
    apps: [
        {
            name: 'foodbliss-api',
            script: 'src/server.js',
            cwd: __dirname,
            node_args: '--experimental-modules',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            env_development: {
                NODE_ENV: 'development',
                PORT: 5000
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true,
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        }
    ]
};

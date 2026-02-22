module.exports = {
    apps: [
        {
            name: 'codex-marketplace',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: '/opt/codex-marketplace',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
        },
    ],
};

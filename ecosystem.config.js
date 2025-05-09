module.exports = {
    apps: [
        {
            name: 'gen-node',
            script: 'dist/main.js',
            max_memory_restart: '1G',
        },
    ],
};

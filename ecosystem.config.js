module.exports = {
    apps: [
        {
            name: 'gen-node',
            script: 'dist/main.js',
            max_memory_restart: '1G',
            error_file: './dist/pm2_giime_gen_node_err.log',
            out_file: './dist/pm2_giime_gen_node_out.log',
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm Z',
        },
    ],
};

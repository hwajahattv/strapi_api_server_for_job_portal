module.exports = {
    transports: [
        {
            level: 'info',
            type: 'console',
            format: 'pretty', // options: 'json', 'pretty', 'simple'
        },
        {
            level: 'error',
            type: 'file',
            filename: 'logs/strapi-errors.log', // will create ./logs/strapi-errors.log
        },
    ],
};

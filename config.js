const config = {
    staging: {
        port: {
            http: 3000,
            https: 3001,
        },
        envName: 'staging',
        hashSecret: 'randomSecret',
    },
    production: {
        port: {
            http: 5000,
            https: 5001,
        },
        envName: 'production',
        hashSecret: 'randomSecret',
    },
    get() {
        const { NODE_ENV } = process.env;
        return this[NODE_ENV || 'staging'];
    }
}

module.exports = config.get();
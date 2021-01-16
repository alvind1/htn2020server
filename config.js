var fs = require('fs')
const config = {
    user: 'user1',
    password: 'passwordpassword',
    host: "cuddly-rabbit-8b8.gcp-northamerica-northeast1.cockroachlabs.cloud",
    port: 26257,
    database: 'defaultdb',
    ssl: {
        ca: fs.readFileSync('./cuddly-rabbit-ca.crt').toString()
    }
}

const connectString = "postgres://user1@cuddly-rabbit-8b8.gcp-northamerica-northeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=cuddly-rabbit-ca.crt"

module.exports = {
    'config': config,
    'connectString' : connectString
}
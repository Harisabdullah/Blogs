exports.sqlConfig = {
    user: "Blogs_user",
    password: "191491",
    //database: "Blogs",
    server: "localhost",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


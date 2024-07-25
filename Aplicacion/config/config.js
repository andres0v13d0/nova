module.exports = {
    development: {
        username: "postgres",
        password: "00000001",
        database: "novabd",
        host: "localhost",
        dialect:"postgres"
    },
    production: {
        username: "root",
        password: "00000001",
        database: "novabd",
        host: "localhost",
        dialect:"mysql"
    }
};

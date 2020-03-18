const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'michaelwong',
    host: 'localhost',
    database: 'project-yellow',
    port: "5432"
});

module.exports = pool;

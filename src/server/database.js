const Pool = require('pg').Pool;
const pool = new Pool({
    host: 'localhost',
    user: 'lucasmerilees',
    password: 'qu33nb3ar',
    database: 'projectyellow',
    port: "5432"
});

module.exports = pool;

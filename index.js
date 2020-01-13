const http = require('http');
const mysql = require('mysql2');

let connection;


const server = http.createServer((req, res) => {
    const {correct, data} = parseReq(req);
    if (correct) {
        query(res, data);
    } else {
        err(res, data);
    }
});

server.listen(3000, () => {
    console.log('Server started');
    createConnectionDB();
    connectionDB();
});

function createConnectionDB() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'db_menu',
        password: 'root',
        port: '3306',
        charset: 'utf8'
    });
}

function connectionDB() {
    connection.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to MySQL');
    })
}

function query(res, sql) {
    connection.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
}

function err(res, message) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(message);
}

function parseReq(req) {
    switch (req.url) {
        case '/menu':
            return {correct: true, data: 'SELECT * FROM db_menu.pizza'};
        default:
            return {correct: false, data: 'Error url'};
    }
}

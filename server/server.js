const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const options = {
    // ca: fs.readFileSync(path.resolve(__dirname, '../certs/ca_crt.pem')),
    // cert: fs.readFileSync(path.resolve(__dirname, '../certs/server_crt.pem')),
    // key: fs.readFileSync(path.resolve(__dirname, '../certs/server_key.pem')),
    // rejectUnauthorized: true,
    // requestCert: true,
};

const app = express();

app.get('/', (req, res) => {
   res.status(200).json({ 'msg': `Hello, it is ${new Date().toISOString()}`});
});

const server = http.createServer(options, app).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
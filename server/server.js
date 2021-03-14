const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const port = 3000;

const options = {
    ca: fs.readFileSync(path.resolve(__dirname, './certs/ca.crt')),
    cert: fs.readFileSync(path.resolve(__dirname, './certs/server.crt')),
    key: fs.readFileSync(path.resolve(__dirname, './certs/server.key')),
    rejectUnauthorized: false,
    requestCert: true,
};

const app = express();

app.get('/', (req, res) => {
    console.log(req.headers)

    if(req.header("ssl_client_verify") !== "SUCCESS")
        return res.status(403).send("Forbidden - please provide valid certificate.")

    res.status(200).json(`Hello ${req.header("ssl_client")}, your certificate was issued by ${req.header("SSL_Client_Issuer")}!`);
});

https.createServer(options, app).listen(port, () => {
    console.log(`.. server up and running and listening on ${port} ..`);
});
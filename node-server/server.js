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
    if(!isEmpty(req.socket.getPeerCertificate())) {
        return verify_certificate(req, res);
    }

    if(req.header("ssl_client_verify") !== "SUCCESS")
        return res.status(403).send("Forbidden - please provide valid certificate.")

    res.status(200).json(`Hello ${req.header("ssl_client")}, your certificate was issued by ${req.header("SSL_Client_Issuer")}!`);
});

https.createServer(options, app).listen(port, () => {
    console.log(`.. server up and running and listening on ${port} ..`);
});

function verify_certificate(request, response) {
    const cert = request.socket.getPeerCertificate();

    if (request.client.authorized) {
        return response.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`);

    }

    if (cert.subject) {
        return response.status(403).send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`);

    } else {
        return response.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
    }
}


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
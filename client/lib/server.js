'use strict';

const express = require('express');
const { readFile } = require('fs').promises;
const { createServer } = require('https');
const { join } = require('path');

// Create a Express HTTP server object.
const app = express();

// Set up the security with HTTP headers.
app.use(require('helmet')({
    dnsPrefetchControl: false,
    expectCt: {
        maxAge: 30,
        enforce: true
    },
    hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true
    }
}));

// Block the search indexing.
app.use((req, res, next) => {
    res.set('X-Robots-Tag', 'noindex');
    next();
});

// Serve the static files.
app.use(express.static(join(__dirname, '..', 'public')));

// Set up the body parser.
app.use(require('body-parser').json());

// Set up the API routing.
app.use('/api', require('./routes'));

// Return the index page if the GET request is unavailable.
const indexPath = join(__dirname, '..', 'public', 'index.html');
app.get('*', (req, res) => res.sendFile(indexPath));

// Return a 400 response if the request is unavailable.
app.all('*', (req, res) => res.sendStatus(400));

// Set up the error handler.
app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        // Return a 500 response if a server-side error is exist.
        res.sendStatus(500);
    }
});

/*
  Import the X.509 certificate and private key from `/keys/cert.pem` and `/keys/key.pem`.
  The certificate and private key must be in PEM format.
  A self-signed certificate will be generated if there has no certificate provided.
*/
Promise.all([readFile('./keys/cert.pem'), readFile('./keys/key.pem')])
    .then(files => {
        return {
            cert: files[0],
            key: files[1]
        };
    })
    .catch(() => {
        return new Promise((resolve, reject) => {
            require('pem').createCertificate({
                selfSigned: true,
                days: 7
            }, (err, keys) => {
                if (err) reject(err);
                resolve({
                    cert: keys.certificate,
                    key: keys.serviceKey
                });
            });
        });
    })
    .then(options => {
        // Listen the port for the connections with TLS.
        createServer(options, app).listen(8443, () => console.log('The HTTPS server is started and listening.'));
    })
    .catch(err => console.error(err));

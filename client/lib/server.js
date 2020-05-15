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
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        // Return a 500 response if a server-side error is exist.
        res.sendStatus(500);
    }
});

// Import the X.509 certificate and private key.
Promise.all([readFile(process.env.TLS_CERT_FILE), readFile(process.env.TLS_KEY_FILE)])
    .then(files => {
        const options = {
            cert: files[0],
            key: files[1]
        };
        const { HOST, PORT } = process.env;
        // Listen the port for the connections with TLS.
        createServer(options, app).listen(PORT, HOST, () => console.log(`The HTTPS server is listening at https://${HOST}:${PORT}.`));
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

'use strict';

// Create a router.
const router = require('express').Router();

// Initialise the client of the network for the user.
require('./init')().then(client => {

    const { network, user } = client;

    router.post('/certificate', (req, res) => {

        //const issueCertificate = network.getContract('IssueCertificate');

    });

}).catch(err => console.error(err));

/**
 * The routing of `/api/peer`.
 * @module api/peer
 */
module.exports = router;

'use strict';

const { UserIDExistError } = require('./errors');

// Create a router.
const router = require('express').Router();

// Initialise the client of the network for the user.
require('./init')().then(client => {

    const { network, register } = client;

    router.post('/certificate', (req, res) => {

        //const issueCertificate = network.getContract('IssueCertificate');

    });

    // Open the register API if the user is admin.
    if (process.env.USER_ID === 'admin') {
        router.post('/register', async (req, res) => {
            let { userID, password, role, affiliation } = req.body;
            if (typeof userID === 'string' && typeof password === 'string') {
                if (typeof role !== 'string' && typeof role !== 'undefined') {
                    res.sendStatus(400);
                }
                if (typeof affiliation !== 'string' && typeof affiliation !== 'undefined') {
                    res.sendStatus(400);
                }
                try {
                    await register({ userID, password, role, affiliation });
                    res.sendStatus(201);
                } catch (err) {
                    if (err instanceof UserIDExistError) {
                        res.status(409).type('text/plain').send(err.message);
                    } else {
                        res.status(400).type('text/plain').send(err.message);
                    }
                }
            } else {
                res.sendStatus(400);
            }
        });
    }

}).catch(err => console.error(err));

/**
 * The routing of `/api/peer`.
 * @module api/peer
 */
module.exports = router;

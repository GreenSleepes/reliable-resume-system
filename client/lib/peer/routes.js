'use strict';

const { UserIDExistError } = require('./errors');

// Create a router.
const router = require('express').Router();

// Initialise the client of the network for the user.
require('./init')().then(client => {

    const { network, register } = client;

    router.get('/certificate', async (req, res) => {
        try {
            const { owner, contentHash } = req.query;
            const args = [owner, contentHash];
            args.forEach(arg => {
                if (typeof arg !== 'string') res.sendStatus(400);
            });
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:queryItem');
            console.log('Start to search for the certificate with arguments:\n[%s, %s]', ...args);
            const result = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`Item found, the item is:\n${result}`);
            res.json(result);
        } catch (err) {
            res.status(400).type('text/plain').send(err.message);
        }
    });

    router.post('/certificate', async (req, res) => {
        try {
            const { issuer, owner, issueDate, itemType, contentHash, pwd } = req.body;
            const args = [issuer, owner, issueDate, itemType, contentHash, pwd];
            args.forEach(arg => {
                if (typeof arg !== 'string') res.sendStatus(400);
            });
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:issue');
            console.log('Start to test and issue a new certificate with arguments:\n[%s, %s, %s, %s, %s, %s]', ...args);
            const testResult = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`After submitting, the result will be:\n${testResult}`);
            const result = JSON.parse((await transaction.submit(...args)).toString());
            console.log(`Successfully issue a new certificate, the result is:\n${result}`);
            res.status(201).json(result);
        } catch (err) {
            res.status(400).type('text/plain').send(err.message);
        }
    });

    router.patch('/certificate', async (req, res) => {
        try {
            const { issuer, owner, contentHash, currentPwd, newPwd } = req.body;
            const args = [issuer, owner, contentHash, currentPwd, newPwd];
            args.forEach(arg => {
                if (typeof arg !== 'string') res.sendStatus(400);
            });
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:updateHash');
            console.log('Start to test and update the certificate with arguments:\n[%s, %s, %s, %s, %s]', ...args);
            const testResult = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`After submitting, the result will be:\n${testResult}`);
            const result = JSON.parse((await transaction.submit(...args)).toString());
            console.log(`Successfully update the proving hash, the result is:\n${result}`);
            res.json(result);
        } catch (err) {
            res.status(400).type('text/plain').send(err.message);
        }
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

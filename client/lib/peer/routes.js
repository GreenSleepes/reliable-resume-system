'use strict';

const { UserIDExistError } = require('./errors');

// Create a router.
const router = require('express').Router();

// Initialise the client of the network for the user.
require('./init')().then(client => {

    const { network, register } = client;

    router.get('/certificate', async (req, res) => {
        try {
            console.log('Received request to search for the certificate.');
            const { issuer, contentHash } = req.query;
            const args = [issuer, contentHash];
            for (const arg of args) {
                if (typeof arg !== 'string') {
                    console.error('The request to request to search for the certificate has invalid elements.');
                    res.sendStatus(400);
                    return;
                }
            }
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:queryItem');
            console.log('Start to search for the certificate with arguments:\n[%s, %s]', ...args);
            const result = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`Item found, the item is:\n${result}`);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(400).type('text/plain').send(err.message);
        }
    });

    router.post('/certificate', async (req, res) => {
        try {
            console.log('Received request to issue a new certificate.');
            const { issuer, owner, issueDate, itemType, contentHash, pwd } = req.body;
            const args = [issuer, owner, issueDate, itemType, contentHash, pwd];
            for (const arg of args) {
                if (typeof arg !== 'string') {
                    console.error('The request to request to issue a new certificate has invalid elements.');
                    res.sendStatus(400);
                    return;
                }
            }
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:issue');
            console.log('Start to test and issue a new certificate with arguments:\n[%s, %s, %s, %s, %s, %s]', ...args);
            const testResult = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`After submitting, the result will be:\n${testResult}`);
            const result = JSON.parse((await transaction.submit(...args)).toString());
            console.log(`Successfully issue a new certificate, the result is:\n${result}`);
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(400).type('text/plain').send(err.message);
        }
    });

    router.patch('/certificate', async (req, res) => {
        try {
            console.log('Received request to update the certificate.');
            const { owner, contentHash, currentPwd, newPwd } = req.body;
            const args = [owner, contentHash, currentPwd, newPwd];
            for (const arg of args) {
                if (typeof arg !== 'string') {
                    console.error('The request to update the certificate has invalid elements.');
                    res.sendStatus(400);
                    return;
                }
            }
            const issueCertificate = network.getContract('issue_certificate');
            const transaction = issueCertificate.createTransaction('org.mainauthority.item:updateHash');
            console.log('Start to test and update the certificate with arguments:\n[%s, %s, %s, %s]', ...args);
            const testResult = JSON.parse((await transaction.evaluate(...args)).toString());
            console.log(`After submitting, the result will be:\n${testResult}`);
            const result = JSON.parse((await transaction.submit(...args)).toString());
            console.log(`Successfully update the proving hash, the result is:\n${result}`);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(400).type('text/plain').send(err.message);
        }
    });

    // Open the register API if the user is admin.
    if (process.env.USER_ID === 'admin') {
        router.post('/register', async (req, res) => {
            const { userID, password, role, affiliation } = req.body;
            console.log(`Received request to create a new identity "${userID}".`);
            if (typeof userID === 'string' && typeof password === 'string') {
                if (typeof role !== 'string' && typeof role !== 'undefined') {
                    console.error(`The request to create a new identity "${userID}" has invalid elements.`);
                    res.sendStatus(400);
                    return;
                }
                if (typeof affiliation !== 'string' && typeof affiliation !== 'undefined') {
                    console.error(`The request to create a new identity "${userID}" has invalid elements.`);
                    res.sendStatus(400);
                    return;
                }
                try {
                    await register({ userID, password, role, affiliation });
                    console.log(`Successfully to create a new identity "${userID}".`);
                    res.sendStatus(201);
                } catch (err) {
                    console.error(err);
                    if (err instanceof UserIDExistError) {
                        res.status(409).type('text/plain').send(err.message);
                    } else {
                        res.status(400).type('text/plain').send(err.message);
                    }
                }
            } else {
                console.error(`The request to create a new identity "${userID}" has invalid elements.`);
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

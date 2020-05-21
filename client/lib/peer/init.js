'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const { readFile } = require('fs').promises;
const { request } = require('https');

const { UserIDExistError } = require('./errors');

/**
 * @typedef UserRegistrationForm
 * @property {string} userID - The identity of the user.
 * @property {string} password - The password for login.
 * @property {string} [role=client] - The role of the user.
 * @property {string} [affiliation=applicant.main] - The affiliation that the user associated.
 */

/**
 * Send a register request to the admin.
 * @param {UserRegistrationForm} form - The form of the registration.
 * @returns {Promise<void>}
 */
const registerRequest = form => new Promise((resolve, reject) => {
    const reqBody = JSON.stringify(form);
    let resBody = '';
    const req = request({
        hostname: process.env.REG_USER_HOST,
        port: process.env.REG_USER_PORT,
        method: 'POST',
        path: '/api/peer/register',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(reqBody)
        },
        rejectUnauthorized: false
    }, res => {
        res.on('data', chunk => resBody += chunk);
        res.on('end', () => {
            if (res.statusCode < 200 || res.statusCode > 299)
                reject(new Error(resBody));
            else
                resolve();
        });
        res.on('error', reject);
    });
    req.on('error', reject);
    req.write(reqBody);
    req.end();
});

/**
 * The process that initialise the client of the network for the user.
 * @module peer/init
 */
module.exports = async () => {
    try {

        const userID = process.env.USER_ID;
        const ca = new FabricCAServices(process.env.CA_URL);
        const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);
        let identity = await wallet.get(userID);

        // Enroll the identity if it is not exist.
        if (!identity) {
            try {
                console.log(`Identity "${userID}" not exist. Trying to register the identity.`);
                await registerRequest({ userID, password: process.env.USER_SECRET });
            } catch (err) {
                console.log(`Failed to register the identity "${userID}".`);
                console.error(err);
            }
            const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: process.env.USER_SECRET });
            await wallet.put(userID, {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes()
                },
                type: 'X.509',
                mspId: process.env.MSP_ID
            });
            identity = await wallet.get(userID);
        }

        // Build the user object.
        const provider = wallet.getProviderRegistry().getProvider(identity.type);
        const user = await provider.getUserContext(identity, userID);

        console.log(`Successfully get the identity "${userID}".\nConnecting to the "main-channel".`);

        const ccp = JSON.parse(await readFile(process.env.CCP_PATH, 'utf8'));
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: userID,
            discovery: {
                asLocalhost: false,
                enabled: true
            }
        });
        const network = await gateway.getNetwork('main-channel');

        console.log('Successfully connect the "main-channel".');

        /**
         * Register a new user by the admin identity.
         * @param {UserRegistrationForm} form - The form of the registration.
         */
        const register = async form => {
            try {
                if (await wallet.get(form.userID)) throw new UserIDExistError(form.userID);
                await ca.register({
                    enrollmentID: form.userID,
                    enrollmentSecret: form.password,
                    role: form.role || 'client',
                    affiliation: form.affiliation || 'applicant.main'
                }, user);
                const enrollment = await ca.enroll({ enrollmentID: form.userID, enrollmentSecret: form.password });
                await wallet.put(form.userID, {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes()
                    },
                    type: 'X.509',
                    mspId: process.env.MSP_ID
                });
                return await wallet.get(form.userID);
            } catch (err) {
                throw err;
            }
        };

        return { network, register };

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

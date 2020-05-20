'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const { readFile } = require('fs').promises;

const { UserIDExistError } = require('./errors');

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

        console.log(`Successfully get the identity "${userID}".`);

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
         * @typedef UserRegistrationForm
         * @property {string} userID - The identity of the user.
         * @property {string} password - The password for login.
         * @property {string} [role=client] - The role of the user.
         * @property {string} [affiliation=applicant.main] - The affiliation that the user associated.
         */

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

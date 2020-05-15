'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const { readFile } = require('fs').promises;

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

        // Enroll the admin identity if it is not exist.
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
                asLocalhost: true,
                enabled: true
            }
        });
        const network = await gateway.getNetwork('main-channel');

        console.log('Successfully connect the "main-channel".');

        return { network, user };

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

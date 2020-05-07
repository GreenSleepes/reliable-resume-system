'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const { readFile } = require('fs').promises;

/**
 * The process that initialise the client of the network for the user.
 * @module peer/init
 */
module.exports = async () => {
    const ca = new FabricCAServices(process.env.CA_URL);
    const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);
    const ccp = JSON.parse(await readFile(process.env.CCP_PATH, 'utf8'));
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: process.env.CLIENT_ID,
        discovery: {
            asLocalhost: true,
            enabled: true
        }
    });
    const network = await gateway.getNetwork('main-channel');
    return { ca, network };
};

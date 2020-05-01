'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const { join } = require('path');

/**
 * The process that initialise the client of the network for the user.
 * @module peer/init
 */
module.exports = async () => {
    const ca = new FabricCAServices(process.env.CA_URL);
    const wallet = await Wallets.newFileSystemWallet(join(__dirname, '..', '..', 'wallet'));
    const gateway = new Gateway();
    await gateway.connect(process.env.CLIENT_CONFIG_PATH, {
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

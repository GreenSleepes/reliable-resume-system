'use strict';

const FabricCAServices = require('fabric-ca-client');
const { newFileSystemWallet } = require('fabric-network').Wallets;
const { join } = require('path');

/**
 * Initialise the client of the network for the user.
 * @module peer/init
 */
module.exports = async () => {
    const ca = new FabricCAServices(process.env.CA_URL);
    const wallet = await newFileSystemWallet(join(process.cwd(), 'wallet'));
    return { ca, wallet };
};

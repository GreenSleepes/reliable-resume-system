'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Item = require('../contract/lib/item.js');

// Main program function
async function main() {

    const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');
    const gateway = new Gateway();

    try {
        const userName = 'isabella';

        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('main-channel');

        const contract = await network.getContract('itemcontract');

        const issueResponse = await contract.submitTransaction();

        let item = CommercialPaper.fromBuffer(issueResponse);

        console.log(`${item.issuer} resume item : ${item.contentHash} is successfully issued at ${item.issueDate}`);
        console.log('Issue complete.');

    } catch (error) {

        console.log(`Error processing issue. ${error}`);
        console.log(error.stack);

    } finally {

        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});

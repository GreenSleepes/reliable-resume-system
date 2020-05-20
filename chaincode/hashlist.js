'use strict';
const Hash = require('./hash.js');
//a list of ledger hash
//the hash are having a unipue composite key to avoid collision 
class HashList {
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};
    }
    //add the hash into the ledger with the composite key
    async addHash(hash) {
        let key = this.ctx.stub.createCompositeKey(this.name, hash.getSplitKey());
        let data = Hash.serialize(hash);
        await this.ctx.stub.putState(key, data);
    }
    //return the JSON of the required hash from the ledger
    async getHash(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, Hash.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            let hash = Hash.deserialize(data, this.supportedClasses);
            return hash;
        } else {
            return null;
        }
    }

    //the update of the existing hash in the ledger
    //However, the update should be consider as a new hash 
    async updateHash(hash) {
        let key = this.ctx.stub.createCompositeKey(this.name, hash.getSplitKey());
        let data = Hash.serialize(hash);
        await this.ctx.stub.putState(key, data);
    }

    use(hashClass) {
        this.supportedClasses[hashClass.getClass()] = hashClass;
    }

}

module.exports = HashList;

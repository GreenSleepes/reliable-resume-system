'use strict';
const Hash = require('./hash.js');

class ItemList {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    async addItem(item) {
        let key = this.ctx.stub.createCompositeKey(this.name, item.getSplitKey());
        let data = Hash.serialize(item);
        await this.ctx.stub.putState(key, data);
    }

    async getItem(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, Hash.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            let item = Hash.deserialize(data, this.supportedClasses);
            return item;
        } else {
            return null;
        }
    }

    async updateItem(item) {
        let key = this.ctx.stub.createCompositeKey(this.name, item.getSplitKey());
        let data = Hash.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    use(hashClass) {
        this.supportedClasses[hashClass.getClass()] = hashClass;
    }

}

module.exports = ItemList;

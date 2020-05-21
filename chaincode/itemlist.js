'use strict';

const { Context } = require('fabric-contract-api');

const Item = require('./item');

class ItemContext extends Context {

    constructor() {
        super();
        this.name = 'org.mainauthority.itemlist';
        this.supportedClasses = { 'org.mainauthority.item': true };
    }

    async addItem(item) {
        const key = this.stub.createCompositeKey(this.name, item.getSplitKey());
        const data = Item.serialize(item);
        await this.stub.putState(key, data);
    }

    async getItem(key) {
        const ledgerKey = this.stub.createCompositeKey(this.name, Item.splitKey(key));
        const data = await this.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            const item = Item.deserialize(data, this.supportedClasses);
            return item;
        } else {
            return null;
        }
    }

    async updateItem(item) {
        const key = this.stub.createCompositeKey(this.name, item.getSplitKey());
        const data = Item.serialize(item);
        await this.stub.putState(key, data);
    }

    use(itemClass, item) {
        this.supportedClasses[item.getClass()] = itemClass;
    }

}

module.exports = ItemContext;

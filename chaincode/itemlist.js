'use strict';
const Item = require('./item.js');

class ItemList {

    constructor(ctx) {
        this.ctx = ctx;
        this.name = 'org.mainauthority.itemlist';
        this.supportedClasses = 'org.mainauthority.item';
    }

    async addItem(item) {
        let key = this.ctx.stub.createCompositeKey(this.name, item.getSplitKey());
        let data = Item.serialize(item);
        await this.ctx.stub.putState(key, data);
    }

    async getItem(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, Item.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            let item = Item.deserialize(data, this.supportedClasses);
            return item;
        } else {
            return null;
        }
    }

    async updateItem(item) {
        let key = this.ctx.stub.createCompositeKey(this.name, item.getSplitKey());
        let data = Item.serialize(item);
        await this.ctx.stub.putState(key, data);
    }
    
    use(itemClass) {
        this.supportedClasses[item.getClass()] = itemClass;
    }
}

module.exports = ItemList;

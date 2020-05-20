'use strict';
const HashList = require('./hashlist.js');
const Item = require('./item.js');

class ItemList extends HashList{

    constructor(ctx) {
        super(ctx, 'org.mainauthority.itemlist');
        this.use(Item);
    }

    async addItem(item) {
        return this.addHash(paper);
    }

    async getItem(item) {
        return this.getHash(itemKey);
    }

    async updateItem(item) {
        return this.updateHash(item);
    }

}

module.exports = ItemList;

'use strict';
const HashList = require('./hashlist.js');
const Item = require('./item.js');

class ItemList extends HashList{

    constructor(ctx) {
        super(ctx, 'org.mainauthority.itemlist');
        this.use(Item);
    }

    async addItem(item) {
        return this.addState(paper);
    }

    async getItem(item) {
        return this.getState(itemKey);
    }

    async updateItem(item) {
        return this.getState(item);
    }

}

module.exports = ItemList;

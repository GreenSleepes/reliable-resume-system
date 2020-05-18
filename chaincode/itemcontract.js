'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Item = require('./item.js');
const ItemList = require('./itemlist.js');

class itemContext extends Context {

    constructor() {
        super();
        this.itemList = new ItemList(this);
    }
}

class ItemContract extends Contract {

    constructor() {
        super('org.mainauthority.item');
    }

    createContext() {
        return new itemContext();
    }


    async issue(ctx, issuer, owner, issueDate, itemType, contentHash, provingHash) {

        let new_item = Item.createInstance(ctx, issuer, owner, issueDate, itemType, contentHash, provingHash);

        new_item.setIssued();

        new_item.setOwner(issuer);

        await ctx.itemList.addItem(new_item);

        return new_item;
    }


    async updateHash(ctx, issuer,owner, contentHash, currentPHash, newPHash) {

        let itemKey = item.makeKey([issuer, contentHash]);
        let new_item = await ctx.itemList.getItem(itemKey);

        if (new_item.getOwner() !== owner) {
            throw new Error('This item: ' + paperNumber + ' is not owned by ' + owner);
        } 
        
        if (new_item.getPHash() === currentPHash) {
            new_item.setPHash(newPHash);
        }else{
        	throw new Error('The old hash entered does not match');
        }

        await ctx.itemList.updateItem(new_item);
        return new_item;
    }


}

module.exports = ItemContract;

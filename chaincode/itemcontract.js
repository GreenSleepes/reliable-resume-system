'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Item = require('./item');
const ItemList = require('./itemlist');
const crypto = require('crypto');

//list of the resume items
class ItemContext extends Context {
    constructor() {
        super();
        this.itemList = new ItemList(this);
    }
}

//item smart contract defination
class ItemContract extends Contract {

    constructor() {
        super('org.mainauthority.item');
    }

    createContext() {
        return new ItemContext();
    }

    //isssue resume item
    async issue(ctx, issuer, owner, issueDate, itemType, contentHash, pwd) {

        const provingHash = crypto.createHash('sha256').update(pwd + contentHash).digest('hex');
        const new_item = Item.createInstance(ctx, issuer, owner, issueDate, itemType, contentHash, provingHash);

        //adding the newly created item to the world state ledger
        await ctx.itemList.addItem(new_item);
        return new_item.serialize();

    }

    //changing the existing proving hash
    async updateHash(ctx, owner, contentHash, currentPwd, newPwd) {

        //retrive the target item from the ledger
        const itemKey = Item.makeKey([owner, contentHash]);
        const new_item = await ctx.itemList.getItem(itemKey);

        //check if the update is made by owner as owner should be the only one who able the update so
        if (new_item.getOwner() !== owner) {
            throw new Error('This item: ' + paperNumber + ' is not owned by ' + owner);
        }

        const CHash = new_item.getCHash();
        const currentPHash = crypto.createHash('sha256').update(currentPwd + CHash).digest('hex');
        const newPHash = crypto.createHash('sha256').update(newPwd + CHash).digest('hex');
        //validate the old hash
        if (new_item.getPHash() === currentPHash) {
            new_item.setPHash(newPHash);
        } else {
            throw new Error('The old hash entered does not match');
        }

        //update the proving hash
        await ctx.itemList.updateItem(new_item);
        return new_item.serialize();

    }

    //query the target item from the ledger
    async queryItem(ctx, owner, contentHash) {

        //retrive the target item from the ledger
        const itemKey = Item.makeKey([owner, contentHash]);
        const target_item = await ctx.itemList.getItem(itemKey);

        console.log(target_item.serialize());
        return target_item.serialize();

    }

}

module.exports = ItemContract;

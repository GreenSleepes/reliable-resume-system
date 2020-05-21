'use strict';

const { Contract } = require('fabric-contract-api');
const Item = require('./item');
const ItemContext = require('./itemlist');
const { createHash } = require('crypto');

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

        const provingHash = createHash('sha256').update(pwd + contentHash).digest('hex');
        const new_item = Item.createInstance(issuer, owner, issueDate, itemType, contentHash, provingHash);

        //adding the newly created item to the world state ledger
        await ctx.addItem(new_item);
        return new_item;

    }

    //changing the existing proving hash
    async updateHash(ctx, owner, contentHash, currentPwd, newPwd) {

        //retrive the target item from the ledger
        const itemKey = Item.makeKey([owner, contentHash]);
        const new_item = await ctx.getItem(itemKey);

        if (!new_item) {
            throw new Error('This item: ' + itemKey + ' not found.');
        }

        //check if the update is made by owner as owner should be the only one who able the update so
        if (new_item.getOwner() !== owner) {
            throw new Error('This item: ' + itemKey + ' is not owned by ' + owner);
        }

        const CHash = new_item.getCHash();
        const currentPHash = createHash('sha256').update(currentPwd + CHash).digest('hex');
        const newPHash = createHash('sha256').update(newPwd + CHash).digest('hex');
        //validate the old hash
        if (new_item.getPHash() === currentPHash) {
            new_item.setPHash(newPHash);
        } else {
            throw new Error('The old hash entered does not match');
        }

        //update the proving hash
        await ctx.updateItem(new_item);
        return new_item;

    }

    //query the target item from the ledger
    async queryItem(ctx, owner, contentHash) {

        //retrive the target item from the ledger
        const itemKey = Item.makeKey([owner, contentHash]);
        const target_item = await ctx.getItem(itemKey);

        if (!target_item) {
            throw new Error('This item: ' + itemKey + ' not found.');
        }

        console.log(target_item.serialize());
        return new_item;

    }

}

module.exports = ItemContract;

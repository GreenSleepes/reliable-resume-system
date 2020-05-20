'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Item = require('./item.js');
const ItemList = require('./itemlist.js');
const crypto = require('crypto');

//list of the resume items
class itemContext extends Context {

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
        return new itemContext();
    }

    //isssue resume item
    async issue(ctx, issuer, owner, issueDate, itemType, contentHash, provingHash) {

        let new_item = Item.createInstance(ctx, issuer, owner, issueDate, itemType, contentHash, provingHash);

	//adding the newly created item to the world state ledger
        await ctx.itemList.addItem(new_item);
        return new_item;
    }

    //changing the existing proving hash
    async updateHash(ctx, issuer,owner, contentHash, currentPHash, newPHash) {
	//retrive the target item from the ledger
        let itemKey = item.makeKey([issuer, contentHash]);
        let new_item = await ctx.itemList.getItem(itemKey);
	
	//check if the update is made by owner as owner should be the only one who able the update so
        if (new_item.getOwner() !== owner) {
            throw new Error('This item: ' + paperNumber + ' is not owned by ' + owner);
        } 
        
        let currentPHash = crypto.createHash('sha256').update(currentPwd + contentHash).digest('hex');
        let newPHash = crypto.createHash('sha256').update(newPwd + contentHash).digest('hex');
        //validate the old hash
        if (new_item.getPHash() === currentPHash) {
            new_item.setPHash(newPHash);
        }else{
        	throw new Error('The old hash entered does not match');
        }
	
	//update the proving hash
        await ctx.itemList.updateItem(new_item);
        return new_item;
    }


}

module.exports = ItemContract;

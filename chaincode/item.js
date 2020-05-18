'use strict';

const Hash = require('./../ledger-api/hash.js');

class Item extends Hash {

    constructor(obj) {
        super(Item.getClass(), [obj.issuer, obj.contentHash]);
        Object.assign(this, obj);
    }


    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getPHash(){
    	return this.provingHash;
    }
    
    setPHash(newPHash){
    	this.provingHash = newPHash;
    }
    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    static createInstance(issuer, owner, issueDate, itemType, contentHash, provingHash) {
        return new Item({ issuer, owner, issueDate, itemType, contentHash, provingHash });
    }

    static getClass() {
        return 'org.mainauthority.item';
    }
}

module.exports = Item;

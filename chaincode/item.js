'use strict';

const Hash = require('./hash.js');

class Item extends Hash {

    constructor(obj) {
        super(Item.getClass(), [obj.issuer, obj.contentHash]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }
    getPHash(){
    	return this.provingHash;
    }
    setPHash(newPHash){
    	this.provingHash = newPHash;
    }
    
    //return the data get into object
    static deserialize(data) {
        return Hash.deserializeClass(data, Item);
    }

    static fromBuffer(buffer) {
        return Item.deserialize(buffer);
    }
    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    //creation of resume item
    static createInstance(issuer, owner, issueDate, itemType, contentHash, provingHash) {
        return new Item({ issuer, owner, issueDate, itemType, contentHash, provingHash });
    }

    static getClass() {
        return 'org.mainauthority.item';
    }
}

module.exports = Item;

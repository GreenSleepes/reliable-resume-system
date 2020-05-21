'use strict';

class Item {

    constructor(obj) {
        this.class = this.getClass();
        this.key = Item.makeKey([obj.owner, obj.contentHash]);
        this.issuer = obj.issuer;
        this.owner = obj.owner;
        this.issueDate = obj.issueDate;
        this.itemType = obj.itemType;
        this.contentHash = obj.contentHash;
        this.provingHash = obj.provingHash;
    }

    getClass() {
        return 'org.mainauthority.item';
    }

    getOwner() {
        return this.owner;
    }

    getCHash() {
        return this.contentHash;
    }

    getPHash() {
        return this.provingHash;
    }

    setPHash(newPHash) {
        this.provingHash = newPHash;
    }

    //combine the elements into a single key
    static makeKey(keyParts) {
        return keyParts.map(part => JSON.stringify(part)).join(':');
    }

    static splitKey(key) {
        return key.split(':');
    }

    getSplitKey() {
        return Item.splitKey(this.key);
    }

    //object toString()
    serialize() {
        return Item.serialize(this);
    }

    static serialize(object) {
        return Buffer.from(`{"class":"${object.class}","key":"${object.key}","issuer":"${object.issuer}","owner":"${object.owner}","issueDate":"${object.issueDate}","itemType":"${object.itemType}","contentHash":"${object.contentHash}","provingHash":"${object.provingHash}"}`);
    }

    //return data into object
    static deserialize(data, supportedClasses) {
        const json = JSON.parse(data.toString());
        const objClass = supportedClasses[json.class];
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        const object = new Item(json);
        return object;
    }

    //return class into object
    static deserializeClass(data) {
        const json = JSON.parse(data.toString());
        const object = new Item(json);
        return object;
    }

    static createInstance(issuer, owner, issueDate, itemType, contentHash, provingHash) {
        return new Item({ issuer, owner, issueDate, itemType, contentHash, provingHash });
    }

}

module.exports = Item;

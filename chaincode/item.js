'use strict';

class Item{

   constructor(obj) {
        this.class = this.getClass;
        this.key = makeKey([obj.owner,obj.contentHash]);
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
    
    //combine the elements into a single key	
    makeKey(keyParts) {
        return keyParts.map(part => JSON.stringify(part)).join(':');
    }

    splitKey(key){
        return key.split(':');
    }

    
    //object toString()
    serialize(object) {
        return Item.serialize(this);
    }
    static serialize(object) {
        return Buffer.from(JSON.stringify(object));
    }
    
    //return data into object
    static deserialize(data, supportedClasses) {
        let json = JSON.parse(data.toString());
        let objClass = supportedClasses[json.class];
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        let object = new (objClass)(json);

        return object;
    }
    //return class into object
    static deserializeClass(data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    }
    
    static createInstance(issuer, owner, issueDate, itemType, contentHash, provingHash) {
        return new Item({ issuer, owner, issueDate, itemType, contentHash, provingHash });
    }
    
}


module.exports = Item;

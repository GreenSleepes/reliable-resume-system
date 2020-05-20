# Reliable Resume System
 A reliable resume system based on blockchain.

## Aim
 This project aims at providing a trustworthy resume information interchange system among organizations and individuals with the use of blockchain technology. The proposed system serves as a prototype of the future electronic certification issuing method. 

## Struture
 The concept of the system is to allow authoried institutions or authority issue resume item and put the issue of item as the record of the ledger. The recorded action can serve as a prove against the modification of content. The content of the resume item will be hashed so as to maintain privacy while making the record public. 
 To further stregthen the struture, proving, a hash of shared secret and content hash, is included. The issuer of the item will use the shared secret to create the initail proving hash. Upon the issue of resume item, the issuer will provide the resume item owner with the item content, content hash and shared secret. The owner can use his own identity and the shared secret to change the proving hash. 
## Key terms
 - Resume item : Qualification which only insitution or authority can issue. There are 3 types in this system : certification, start of employment and end of employment. Note that start of employment and end of employment jointly form one single employment history.
 - content hash : Hash of the resume item content. Provided by the isser. The content should be in JSON file like, a manner that "Title : Vaule"
 - proving hash : Hash of the shared secret and content has. Can only be modified by the owner upon item issue. 
 - chain code : The definition of the function for the ledger manipulation. 
## Prerequisites
 - Docker : 17.06.2-ce or above
 - Docker-compose : 1.14.0 or above
 - Node.js : 12.0 or above
 - NPM :  5.6.0 or above
## Installation

## Run

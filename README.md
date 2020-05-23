# Reliable Resume System
 A reliable resume system based on blockchain.

## Aim
 This project aims at providing a trustworthy resume information interchange system among organizations and individuals with the use of blockchain technology. The proposed system serves as a prototype of the future electronic certification issuing method.

## Struture
 The concept of the system is to allow authoried institutions or authority issue resume item and put the issue of item as the record of the ledger. The recorded action can serve as a prove against the modification of content. The content of the resume item will be hashed so as to maintain privacy while making the record public.
 To further stregthen the struture, proving, a hash of shared secret and content hash, is included. The issuer of the item will use the shared secret to create the initail proving hash. Upon the issue of resume item, the issuer will provide the resume item owner with the item content, content hash and shared secret. The owner can ask help from the issuet to change the proving hash.
## Key terms
 - Resume item : Qualification which only insitution or authority can issue. There are 3 types in this system : certification, start of employment and end of employment. Note that start of employment and end of employment jointly form one single employment history.
 - content hash : Hash of the resume item content. Provided by the isser. The suggested content is in JSON file like, a manner that "Title : Vaule" for easy manipulation.
 - proving hash : Hash of the shared secret and content hash. Owner can request for change of proving hash by the help of issuer.
 - chain code : The definition of the function for the ledger manipulation.
## Prerequisites
 - Docker: 19.03.5 or above
 - Docker Compose: 1.24.1 or above
 - Node.js: 12.x
 - npm: 6 or above
 - Python: 2.7.x
 - cURL
 - GNU Make
 - G++
## Installation
1. cd reliable-resume-sytem
2. sudo chmod 777 ./build.sh
   sudo chmod 777 ./reset.sh
3. docker stop $(docker ps -a -q)
   docker rm $(docker ps -a -q)
   docker volume prune
   docker system prune
4. ./build.sh
   docker-compose up -d
## Run
The web client of institution
https://localhost:8443
The web client of applicant
https://locahost:9443

In case of web client not running, docker ps to see if the client contianer (client.__.mainauthority.com) is running
If not, repeat the steps in above and move to the client folder
cd ./client
sudo rm -r node_modules

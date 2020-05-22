'use strict';

const crypto = require('crypto');
var readline = require('readline-sync');
var item = {};
var eoi = false;

console.log("Please enter the resume item content row by row and title after content");
console.log("Each row shold contain 1 title and 1 vaule");
console.log("End input process by entering EndOfInput in the row title prompt");
//Sample log
console.log("**For example : Name : Chan Tai Man  should be entered in");
console.log("**Please enter the title : Name");
console.log("**Please enter the content : Chan Tai Man");
console.log("**Please enter the title : EndOfInput");
console.log('**The item entered is : {"Name":"Chan Tai Man"}');
console.log("**And the content Hash is : f5454463008f76a00c3861a87bec3ad005d818326b8aebe8ed074f2103efc6bb");

while(!eoi){
var new_title = readline.question("Please enter the title : ");
 if(new_title === "EndOfInput"){
	eoi = true;	
 }else{
	var new_content = readline.question("Please enter the content : ");
	item[new_title] = new_content;
 }
}

console.log("The item entered is : " + JSON.stringify(item));
var content_hash = crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
console.log("And the content hash is : " + content_hash);
var pwd = readline.question("Please enter the serect key : ", {hideEchoBack: true});
var proving_hash = crypto.createHash('sha256').update(pwd + JSON.stringify(item)).digest('hex');

item.contentHash = content_hash;
item.provingHash = proving_hash;
console.log(item);

var fs = require('fs');
fs.writeFile('itemWithHashes.json', JSON.stringify(item), 'utf8',function readFileCallback(err, data){
    if (err){
        console.log(err);
    } });
console.log("An json file with the content and hashes has been created : itemWithHashes.json");




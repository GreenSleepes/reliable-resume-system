const crypto = require('crypto');
var readline = require('readline-sync');
var item = {}
var eoi = false;


console.log("Please enter the resume item content row by row and title after content");
console.log("Each row shold contain 1 title and 1 vaule");
console.log("End input process by entering EndOfInput in the row title prompt");
//Sample log
console.log("**For example : Name : Chan Tai Man  should be entered in");
console.log("**Please enter the title : Name");
console.log("**Please enter the content : Chan Tai Man");
console.log("**Please enter the title : EndOfInput");

while(!eoi){
var new_title = readline.question("Please enter the title : ");
 if(new_title === "EndOfInput"){
	eoi = true;	
 }else{
	var new_content = readline.question("Please enter the content : ");
	item[new_title] = new_content;
 }
}

try{
console.log("The item from the json file is : \n" + JSON.stringify(item));

if (item.contentHash != null)
	var concontent_hash= item.contentHash;
else throw"There is no content hash in the file!";
if (item.contentHash != null)
	var proving_hash = item.provingHash;
else throw"There is no proving hash in the file!";

var checkCH = readline.question("Please enter the provided content hash : ");
var checkPH = readline.question("Please enter the provided proving hash : ");
if(checkCH == content_hash)
	console.log("The content hash match!");
else
	throw"The contents hash not match!";
	
if(checkPH == proving_hash)
	console.log("The proving hash match!");
else
	throw"The proving hash not match!";

	} catch (err){
	console.log(err);
	}	

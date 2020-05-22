var readline = require('readline-sync');
var path = readline.question("Please enter the json path : ");



try{
var item = require(path);
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

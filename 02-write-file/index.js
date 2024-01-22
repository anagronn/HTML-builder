const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin, stdout } = require('process');
const filePath = path.join(__dirname, 'newFile.txt');
const writeStream = fs.createWriteStream(filePath);
stdout.write("Hello, world!\n");
stdin.on("data", function(data){
  stdout.write(data);
})
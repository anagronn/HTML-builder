const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);
readStream.on('data', function(data){ 
  stdout.write(data);
});
readStream.on('error', (err) => {
  console.error(`Error reading the file: ${err.message}`);
});
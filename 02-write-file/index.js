const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, 'newFile.txt');
const writeStream = fs.createWriteStream(filePath);
rl.write("Hello, world!\nEnter some words, please\n");
rl.on("line", function(input) {
  const dataStringified = input.toString();
  if (dataStringified === 'exit') {
    writeStream.end();
    rl.close();
  } else writeStream.write(dataStringified + '\n');
});

rl.on('close', () => {
  writeStream.end();
  rl.write("Goodbye, world! The proccess is stopped");
  process.exit();
});
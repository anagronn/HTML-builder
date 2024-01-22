const fs = require('fs');  
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');
const dirPath = path.join(distPath, 'styles');
const bundleFile = path.join(distPath, 'bundle.css');
const writeStream = fs.createWriteStream(bundleFile);

async function createBundle() {
  try {
    const files = await fs.promises.readdir(dirPath);  
    await Promise.all(files.map(async file => {
      const filePath = path.join(dirPath, file);
      const stats = await fs.promises.stat(filePath);  
      if (stats.isFile() && path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(filePath);
        await new Promise((resolve, reject) => {
          readStream.pipe(writeStream, { end: false });
          readStream.on('end', resolve);
          readStream.on('error', reject);
        });
      }
    }));
    writeStream.end();
    console.log('bundle.css is created');
  } catch (err) {
    console.error("Smthg gone wrong", err);
  }
}

createBundle();

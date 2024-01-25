const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');

async function createDirectory() {
  try {
    const createDir = fs.promises.mkdir(distPath, {
      recursive: true,
    });
  } catch (err) {
    console.error(err.message);
  }
}


const styleDirPath = path.join(__dirname, 'styles');
const bundleFile = path.join(distPath, 'style.css');
const writeStream = fs.createWriteStream(bundleFile);
async function createBundle() {
  try {
    const files = await fs.promises.readdir(styleDirPath);
    await Promise.all(files.map(async file => {
      const filePath = path.join(styleDirPath, file);
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

const prevDirPath = path.join(__dirname, 'assets');
const newDirPath = path.join(distPath, 'assets');

async function isDirectoryExists(directory) {
  try {
    await fs.promises.access(directory, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function deleteFiles(directory) {
  try {
    const files = await fs.promises.readdir(directory);
    await Promise.all(files.map(async file => {
      const filePath = path.join(directory, file);
      const stats = await fs.promises.stat(filePath);

      if (stats.isDirectory()) {
        await deleteFiles(filePath);
        await fs.promises.rmdir(filePath);
      } else {
        await fs.promises.unlink(filePath);
      }
    }));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function createCopy(oldDir, newDir) {
  try {
    await fs.promises.mkdir(newDir);

    const files = await fs.promises.readdir(oldDir);
    await Promise.all(files.map(async file => {
      const oldFile = path.join(oldDir, file);
      const newFile = path.join(newDir, file);

      const stats = await fs.promises.stat(oldFile);

      if (stats.isFile()) {
        await fs.promises.copyFile(oldFile, newFile);
      } else {
        await createCopy(oldFile, newFile);
      }
    }));
    console.log(`Files are copied!`);
  } catch (err) {
    console.error("Something is wrong", err);
  }
}

async function replaceTags() {
  try {
    const filePath = path.join(__dirname, 'template.html');
    let templateContent = await fs.promises.readFile(filePath, 'utf-8');
    const indexFile = path.join(distPath, 'index.html');
    let tagNames = templateContent.match(/\{\{(.*?)\}\}/g).map(tag => tag.replace(/\{\{|\}\}/g, ''));
    const componentsPath = path.join(__dirname, 'components');
    const files = await fs.promises.readdir(componentsPath);
    await Promise.all(files.map(async file => {
      const fileContent = await fs.promises.readFile(path.join(componentsPath, file), 'utf-8');
      tagNames.forEach((tag) => {
        if (tag === path.basename(file, path.extname(file))) {
          templateContent = templateContent.replace('{{' + tag + '}}', fileContent);
        }
      })
    }));
    await fs.promises.writeFile(indexFile, templateContent);
    console.log('Tag names:', tagNames);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}


createDirectory();
replaceTags();
createBundle();
(async () => {
  if (!(await isDirectoryExists(newDirPath))) {
    await createCopy(prevDirPath, newDirPath);
  } else {
    if (await deleteFiles(newDirPath)) {
      try {
        await fs.promises.rmdir(newDirPath);
        await createCopy(prevDirPath, newDirPath);
      } catch (err) {
        console.error(err);
      }
    }
  }
})();


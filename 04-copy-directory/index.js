const fs = require('fs/promises');
const path = require('path');
const prevDirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

async function isDirectoryExists(directory) {
  try {
    await fs.access(directory, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function deleteFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    await Promise.all(files.map(file => fs.unlink(path.join(directory, file))));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function createCopy(oldDir, newDir) {
  try {
    await fs.mkdir(newDir);

    const files = await fs.readdir(oldDir);
    await Promise.all(files.map(async file => {
      const oldFile = path.join(oldDir, file);
      const newFile = path.join(newDir, file);

      const stats = await fs.stat(oldFile);

      if (stats.isFile()) {
        await fs.copyFile(oldFile, newFile);
      }
    }));
    console.log(`Files are copied!`);
  } catch (err) {
    console.error("Something is wrong",err);
  }
}

(async () => {
  if (!(await isDirectoryExists(newDirPath))) {
    await createCopy(prevDirPath, newDirPath);
  } else {
    if (await deleteFiles(newDirPath)) {
      try {
        await fs.rmdir(newDirPath);
        await createCopy(prevDirPath, newDirPath);
      } catch (err) {
        console.error(err);
      }
    }
  }
})();

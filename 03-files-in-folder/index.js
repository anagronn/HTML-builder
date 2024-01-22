const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  } else console.log("Содержимое секретной папки:");

  files.forEach(file => {
    const filePath = path.join(dirPath, file.name);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExt = path.extname(file.name).slice(1);
        console.log(`${fileName} - ${fileExt} - ${stats.size}b`);
      }
    });
  });
});

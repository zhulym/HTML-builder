const fs = require('fs');
const promise = require('fs').promises;
const path = require('path');
const { stdout } = process;
const sym = '\u2550';

const distFiles = path.join(__dirname, 'files');
const distFilesCopy = path.join(__dirname, 'files-copy');

fs.readdir(distFilesCopy, (error, files) => {
  if (!error) {
    for (const file of files) {
      fs.unlink(path.join(distFilesCopy, file), error => {
        if (error) throw error;
      });
    }
  } else return;
});

fs.mkdir(distFilesCopy, { recursive: true }, error => {
  if (error) throw error;
});

fs.readdir(distFiles, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  for (let file of files) {
    const currentFile = file.name.toString();
    stdout.write(`File ${file.name} completed!\n`);
    promise.copyFile(path.join(__dirname, 'files', currentFile), path.join(__dirname, 'files-copy', currentFile))
      .catch(error => {
        if (error) throw error;
      })
  }
})

stdout.write(`${sym.repeat(60)}\n`);

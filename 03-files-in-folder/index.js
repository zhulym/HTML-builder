const fs = require('fs');
const path = require('path');
const { stdout } = process;
const sym = '\u2550';

stdout.write(`${sym.repeat(30)}\n`)
fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  for (let file of files) {
    if (file.isFile()) {
      const name = path.basename(file.name).split('.')[0];
      const extension = path.extname(file.name).slice(1);
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
        if (error) throw error;
        const size = stats.size * 0.001;
        stdout.write(`${name} - ${extension} - ${size}kb\n`);
        if (files[files.length - 1] === file) stdout.write(`${sym.repeat(30)}\n`);
      })
    }
  }
});
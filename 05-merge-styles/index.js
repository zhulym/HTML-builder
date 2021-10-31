const fs = require('fs');
const path = require('path');
const { stdout } = process;
const sym = '\u2550';

const folderStyles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.mkdir(dist, { recursive: true }, error => {
  if (error) throw error;
});
fs.writeFile(bundle, '', error => {
  if (error) throw error;
})
fs.readdir(folderStyles, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      fs.readFile(`${folderStyles}/${file.name}`, 'utf-8', (error, data) => {
        if (error) throw error;
        else {
          fs.appendFile(bundle, data, error => {
            if (error) throw error;
          })
        }
      })
    }
  }
})

stdout.write(`\u2554${sym.repeat(36)}\u2557\n`)
stdout.write('\u2551***  Bundle created or updated!  ***\u2551\n')
stdout.write(`\u255A${sym.repeat(36)}\u255D\n`)


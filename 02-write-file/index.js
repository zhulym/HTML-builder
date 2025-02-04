const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const sym = '\u2550';

stdout.write(`\u2554${sym.repeat(59)}\u2557\n`)
stdout.write('\u2551***  For exit: ctrl + c or exit. Enter your text below  ***\u2551\n')
stdout.write(`\u255A${sym.repeat(59)}\u255D\n`)

const writeStream = fs.createWriteStream(path.join(__dirname, 'newFile.txt'), 'utf-8');

stdin.on('data', data => {
  if (data.toString().trim() !== 'exit') writeStream.write(data);
  else {
    stdout.write(`${sym.repeat(60)}\n`);
    stdout.write('--=== Buy!!!!!!! ===-- \n');
    process.exit();
  }
});

process.on('SIGINT', () => {
  stdout.write(`${sym.repeat(60)}\n`);
  stdout.write('--=== Buy!!! ===-- \n');
  process.exit();
});

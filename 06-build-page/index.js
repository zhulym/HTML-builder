const fs = require('fs');
const path = require('path');
const promise = require('fs').promises;

const dist = path.join(__dirname, 'project-dist');
const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

fs.mkdir(dist, { recursive: true }, error => {
  if (error) throw error;
});

// SOLUTION FOR NODE 16

const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');

const pathTemplate = path.join(__dirname, 'template.html');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');

const pathComponents = path.join(__dirname, 'components');

const pathDist = path.join(__dirname, 'project-dist');
const pathDistHtml = path.join(pathDist, 'index.html');
const pathDistStyle = path.join(pathDist, 'style.css');
const pathDistAssets = path.join(pathDist, 'assets');

const bundleHTML = async () => {
  const htmlFiles = await promises.readdir(pathComponents);
  const files = htmlFiles.filter(file => path.extname(file) === '.html');
  const streamR = fs.createReadStream(pathTemplate, 'utf8');
  streamR.on('data', async (template) => {
    let html = template.toString();
    for (let file of files) {
      const filePath = path.join(pathComponents, file);
      const component = await promises.readFile(filePath);
      const name = path.basename(file, '.html');
      html = html.replace(`{{${name}}}`, component);
    }
    await promises.writeFile(pathDistHtml, html, 'utf8');
  });
}

const bundleCss = async () => {
  const cssFiles = await promises.readdir(pathStyles);
  const filterFiles = cssFiles.filter(file => path.extname(file) === '.css');
  const streamW = fs.createWriteStream(pathDistStyle, 'utf8');
  mergeStream(filterFiles, streamW);
}
function mergeStream(files = [], stream) {
  if (!files.length) { return stream.end() }
  const file = path.resolve(pathStyles, files.pop());
  const streamR = fs.createReadStream(file, 'utf8');
  streamR.pipe(stream, { end: false });
  streamR.on('end', function () {
    stream.write('\n\n');
    mergeStream(files, stream);
  });
  streamR.on('error', function (error) {
    console.error(error);
    stream.close();
  });
}

const copyAssets = async (dist, src) => {
  await promises.mkdir(dist, { recursive: true });
  const files = await promises.readdir(src);

  files.forEach(async (file) => {
    const old = path.join(src, file);
    const newF = path.join(dist, file);
    const stat = await promises.stat(old);
    if (stat.isDirectory()) copyAssets(newF, old);
    else await promises.copyFile(old, newF);
  });
}

async function delDistFolder(pathDist) {
  await promises.rm(pathDist, { recursive: true, force: true });
  await promises.mkdir(pathDist, { recursive: true });
}

const createPage = async () => {
  await delDistFolder(pathDist);
  bundleHTML();
  bundleCss();
  copyAssets(pathDistAssets, pathAssets);
}
createPage();


// SOLUTION ONLY FOR NODE 14 LTE

// const fs = require('fs');
// const path = require('path');
// const dist = path.join(__dirname, 'project-dist');
// const pathDistHtml = path.join(__dirname, 'project-dist', 'index.html');
// const pathStyles = path.join(__dirname, 'styles');
// const pathDistStyle = path.join(__dirname, 'project-dist', 'style.css');
// const pathAssets = path.join(__dirname, 'assets');
// const pathDistAssets = path.join(__dirname, 'project-dist', 'assets');

// fs.mkdir(dist, { recursive: true }, error => {
//   if (error) throw error;
// });

// const templateHtml = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
// const indexHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
// templateHtml.pipe(indexHtml);

// fs.readFile(pathDistHtml, "utf-8", (error, data) => {
//   if (error) throw error;
//   fs.readFile(path.join(__dirname, 'components', 'header.html'), "utf-8", (error, header) => {
//     if (error) throw error;
//     data = data.replace("{{header}}", header);
//     fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
//       if (error) throw error;
//     });
//   });
//   fs.readFile(path.join(__dirname, 'components', 'articles.html'), "utf-8", (error, articles) => {
//     if (error) throw error;
//     data = data.replace("{{articles}}", articles);
//     fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
//       if (error) throw error;
//     });
//   }
//   );
//   fs.readFile(path.join(__dirname, 'components', 'footer.html'), "utf-8", (error, footer) => {
//     if (error) throw error;
//     data = data.replace("{{footer}}", footer);
//     fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
//       if (error) throw error;
//     });
//   });
//   fs.access("06-build-page/components/about.html", (error) => {
//     if (!error) {
//       fs.readFile(path.join(__dirname, 'components', 'about.html'), "utf-8", (error, about) => {
//         if (error) throw error;
//         data = data.replace("{{about}}", about);
//         fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
//           if (error) throw error;
//         })
//       })
//     }
//   })
// });

// fs.writeFile(pathDistStyle, '', error => {
//   if (error) throw error;
// })
// fs.readdir(pathStyles, { withFileTypes: true }, (error, files) => {
//   if (error) throw error;
//   for (let file of files) {
//     if (path.extname(file.name) === '.css') {
//       fs.readFile(`${pathStyles}/${file.name}`, 'utf-8', (error, data) => {
//         if (error) throw error;
//         else {
//           fs.appendFile(pathDistStyle, data, error => {
//             if (error) throw error;
//           })
//         }
//       })
//     }
//   }
// })

// fs.readdir(pathAssets, { withFileTypes: true }, (error, files) => {
//   if (error) throw error;
//   fs.mkdir(pathDistAssets, { recursive: true }, error => {
//     if (error) throw error;
//   });
//   for (let file of files) {
//     copyAssets(file);
//     function copyAssets(fl) {
//       if (fl.isFile()) {
//         fs.readFile(`${pathAssets}/${file.name}/${fl.name}`, "utf-8", (error, data) => {
//           if (error) throw error;
//           else {
//             fs.createReadStream(`${pathAssets}/${file.name}/${fl.name}`).pipe(
//               fs.createWriteStream(`${pathDistAssets}/${file.name}/${fl.name}`)
//             );
//           }
//         });
//       } else {
//         fs.mkdir(`${pathDistAssets}/${fl.name}`, { recursive: true }, error => {
//           if (error) throw error;
//         });
//         const nextPath = path.join(__dirname, `assets/${fl.name}`);
//         fs.readdir(nextPath, { withFileTypes: true }, (error, data) => {
//           if (error) throw error;
//           const pathDistAssets = path.join(__dirname, `project-dist/assets/${fl.name}`);
//           data.forEach(el => copyAssets(el));
//         });
//       }
//     }
//   }
// })
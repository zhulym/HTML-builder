const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, 'project-dist');
const pathDistHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathStyles = path.join(__dirname, 'styles');
const pathDistStyle = path.join(__dirname, 'project-dist', 'style.css');
const pathAssets = path.join(__dirname, 'assets');
const pathDistAssets = path.join(__dirname, 'project-dist', 'assets');

fs.mkdir(dist, { recursive: true }, error => {
  if (error) throw error;
});

const templateHtml = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const indexHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
templateHtml.pipe(indexHtml);

fs.readFile(pathDistHtml, "utf-8", (error, data) => {
  if (error) throw error;
  fs.readFile("06-build-page/components/header.html", "utf-8", (error, header) => {
    if (error) throw error;
    data = data.replace("{{header}}", header);
    fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
      if (error) throw error;
    });
  });
  fs.readFile("06-build-page/components/articles.html", "utf-8", (error, articles) => {
    if (error) throw error;
    data = data.replace("{{articles}}", articles);
    fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
      if (error) throw error;
    });
  }
  );
  fs.readFile("06-build-page/components/footer.html", "utf-8", (error, footer) => {
    if (error) throw error;
    data = data.replace("{{footer}}", footer);
    fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
      if (error) throw error;
    });
  });
  fs.readFile("06-build-page/components/about.html", "utf-8", (error, about) => {
    if (!error) {
      data = data.replace("{{about}}", about);
      fs.writeFile(pathDistHtml, data, "utf-8", (error) => {
        if (error) throw error;
      });
    } else return;
    if (error) throw error;
  });
});


fs.writeFile(pathDistStyle, '', error => {
  if (error) throw error;
})
fs.readdir(pathStyles, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      fs.readFile(`${pathStyles}/${file.name}`, 'utf-8', (error, data) => {
        if (error) throw error;
        else {
          fs.appendFile(pathDistStyle, data, error => {
            if (error) throw error;
          })
        }
      })
    }
  }
})

fs.readdir(pathAssets, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  fs.mkdir(pathDistAssets, { recursive: true }, error => {
    if (error) throw error;
  });

  for (let file of files) {
    copyAssets(file);
    function copyAssets(fl) {
      if (fl.isFile()) {
        fs.readFile(`${pathAssets}/${file.name}/${fl.name}`, "utf-8", (error, data) => {
          if (error) throw error;
          else {
            fs.writeFile(`${pathDistAssets}/${file.name}/${fl.name}`, data, "utf-8", error => {
              if (error) throw error;
            });
          }
        });
      } else {
        fs.mkdir(`${pathDistAssets}/${fl.name}`, { recursive: true }, error => {
          if (error) throw error;
        });
        const nextPath = path.join(__dirname, `assets/${fl.name}`);
        fs.readdir(nextPath, { withFileTypes: true }, (error, data) => {
          if (error) throw error;
          data.forEach(el => copyAssets(el));
        });
      }
    }
  }
})
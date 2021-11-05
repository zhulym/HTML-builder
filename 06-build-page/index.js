const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'project-dist');
const pathAssets = path.join(__dirname, 'assets');
const pathStyles = path.join(__dirname, 'styles');
const pathDistHtml = path.join(__dirname, 'project-dist', 'index.html');

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


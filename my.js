const http = require("http");
const fs = require("fs");
const qs = require("qs");
const port = 3000;
const host = "localhost";
const url = require("url");
const escapeHtml = require("escape-html");
const {type} = require("os");
const ManagerController = require("./controller/ManagerController");
const manager = new ManagerController();
const {Server} = require("socket.io");
let mimeTypes = {
  jpg: "images/jpg",
  png: "images/png",
  js: "text/javascript",
  css: "text/css",
  svg: "image/svg+xml",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
  eot: "application/vnd.ms-fontobject",
};
const path = [
  "./src/views/manager.html",
  "./src/views/details.html",
  "./src/views/controller.html",
  "./src/views/create.html",
  "./src/views/edit.html",
];
const urlName = ["/", "/admin", "/details", "/delete", "/edit"];
const server = http.createServer(async (req, res) => {
  let urlPathName = url.parse(req.url).pathname;
  const method = req.method;
  let index = url.parse(req.url).query;
  const filesDefences = urlPathName.match(
    /\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/
  );
  if (filesDefences) {
    const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
    res.writeHead(200, {"content-type": extension});
    fs.createReadStream(__dirname + "/" + req.url).pipe(res);
  } else {
    switch (urlPathName) {
      case "/":
        manager.showHomePage(req, res);
        break;
      case "/details-city":
        manager.showDetailsCity(req, res, index);
        break;
      case "/edit":
        if (method == "GET") {
          manager.showViewEditCity(req, res, index);
        } else {
          manager.editCity(req, res, index);
        }
        break;
      case "/delete":
        manager.deleteCity(req, res, index);
        break;
      case "/create":
        if (method == "GET") {
          manager.showViewCreateCity(req, res);
        } else {
          manager.createNewCity(req, res);
        }
        break;
      default:
        res.end();
    }
  }
});
server.listen(port, host);

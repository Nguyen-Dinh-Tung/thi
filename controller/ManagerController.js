const fs = require("fs");
const qs = require("qs");
const SqlController = require("../sql/SqlController");
const cookie = require("cookie");
const sql = new SqlController();
const mySql = new SqlController();
class ManagerController {
  showHomePage(req, res) {
    fs.readFile("./src/views/manager.html", "utf-8", async (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      let html = "";
      let dataFromSql = await sql.getDataFromSql();
      dataFromSql.forEach((element, index) => {
        html += ` <tr>
        <td>${index}</td>
        <td>${element.name}</td>
        <td>${element.country}</td>
        <td><a href="/details-city?${element.id}"><button class="btn">Chi tiết</button></a></td>
        <td><a href="/delete?${element.id}"><button class="btn">delete</button></a></td>
        <td><a href="/edit?${element.id}"><button class="btn">sửa</button></a></td>
        </tr>
        `;
      });
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async showDetailsCity(req, res, index) {
    let dataFromSql = await sql.getDataFromSql();
    fs.readFile("./src/views/details.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      let html = "";
      dataFromSql.forEach((element) => {
        if (element.id == index) {
          html += `
          <tr>
          <td>${element.area}</td>
          <td>${element.population}</td>
          <td>${element.description}</td>
          </tr>
          `;
        }
      });
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  async showViewEditCity(req, res, index) {
    let dataFromSql = await sql.getDataFromSql();
    let html = "";
    dataFromSql.forEach((element) => {
      if (element.id == index) {
        html += `
        <tr>
        <td>${element.name}</td>
        <td>${element.country}</td>
        <td>${element.area}</td>
        <td>${element.population}</td>
        <td>${element.description}</td>
        </tr>
        `;
      }
    });
    let htmls = "";
    dataFromSql.forEach((element) => {
      if (element.id == index) {
        htmls = `
      <input type="text" class="edit-form" name="name" value="${element.name}">
      <input type="text" class="edit-form" name="country" value="${element.country}">
      <input type="text" class="edit-form" name="area" value="${element.area}">
      <input type="text" class="edit-form" name="population" value="${element.population}">
      <input type="text" class="edit-form" name="description" value="${element.description}">
      <button class="btn-edit" type="submit">Sửa</button>
      `;
      }
    });
    fs.readFile("./src/views/edit.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      data = data.replace("{input}", htmls);
      data = data.replace("{change}", html);
      res.write(data);
      res.end();
    });
  }
  editCity(req, res, index) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let dataForm = qs.parse(data);
      mySql.editFromInfoCity(index, dataForm);
      mySql.editFromCityDetails(index, dataForm);
      res.writeHead(301, {location: "/"});
      res.end();
    });
  }
  deleteCity(req, res, index) {
    mySql.deleteCity(index);
    res.writeHead(301, {location: "/"});
    res.end();
  }
  showViewCreateCity(req, res) {
    fs.readFile("./src/views/create.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      res.write(data);
      res.end();
    });
  }
  createNewCity(req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let dataForm = qs.parse(data);
      sql.createNewCity(dataForm);
      res.writeHead(301, {location: "/"});
      res.end();
    });
  }
}
module.exports = ManagerController;

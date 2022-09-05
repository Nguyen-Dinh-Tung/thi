const mysql = require("mysql");
class SqlController {
  connect = this.connectionDatabase();
  connectionDatabase() {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123123",
      database: "city",
    });

    connection.connect();
    return connection;
  }
  getDataFromSql() {
    const sql = `select * from city`;
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  editFromInfoCity(index, data) {
    const sql = `update info_city set name = '${data.name}' , country = '${data.country}' where id = ${index}`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("updata success info city");
    });
  }
  editFromCityDetails(index, data) {
    console.log(data);
    const sql = `update city_details set area = ${Number(
      data.area
    )}, population = ${Number(data.population)}, description = '${
      data.description
    }' where id = ${Number(index)}`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("updata success details");
    });
  }
  deleteCity(index) {
    let info_city = `delete from info_city where id = ${Number(index)}`;
    let city_details = `delete from city_details where id = ${Number(index)}`;
    this.sqlDelete(info_city);
    this.sqlDelete(city_details);
  }
  sqlDelete(sql) {
    this.connectionDatabase().query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("Delte Success");
    });
  }
  async createNewCity(data) {
    this.insertCityDetails(data);
    let id = await this.getMaxId();
    let maxId = id[0].id;
    this.insertInfoCity(data, maxId);
  }

  insertInfoCity(data, id) {
    const sql = `insert into info_city (name , country ,id_details_city)
    values('${data.name}' , '${data.country}' , ${Number(id)})`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("insert success info City");
    });
  }
  insertCityDetails(data) {
    const sql = `insert into city_details (area , population , description) values
    (${Number(data.area)} , ${Number(data.population)} , '${
      data.description
    }')`;
    this.connect.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("insert success City details");
    });
  }
  getMaxId() {
    const sql = `select max(id) as id from city_details`;
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
}
module.exports = SqlController;

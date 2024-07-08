import mysql from "mysql";
import {DB_HOST,DB_DATABASE,DB_USER,DB_PASSWORD} from './config.js';


export const dbConnection = mysql.createConnection({
    host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});

dbConnection.connect((err) => {
  if (!err) {
    return console.log("DB is connected");
  } else {
    return console.error(err);
  }
});

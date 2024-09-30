"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbConnection = void 0;
var _mysql = _interopRequireDefault(require("mysql"));
var _config = require("./config.js");
var dbConnection = exports.dbConnection = _mysql["default"].createConnection({
  host: _config.DB_HOST,
  user: _config.DB_USER,
  password: _config.DB_PASSWORD,
  database: _config.DB_DATABASE
});
dbConnection.connect(function (err) {
  if (!err) {
    return console.log("DB is connected");
  } else {
    return console.error(err);
  }
});
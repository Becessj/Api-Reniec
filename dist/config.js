"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB_PORT = exports.DB_DATABASE = exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.PORT = void 0;

var _dotenv = require("dotenv");

(0, _dotenv.config)();
var PORT = process.env.PORT || 3000;
exports.PORT = PORT;
var DB_USER = process.env.DB_USER || 'root';
exports.DB_USER = DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD || '';
exports.DB_PASSWORD = DB_PASSWORD;
var DB_HOST = process.env.DB_HOST || 'localhost';
exports.DB_HOST = DB_HOST;
var DB_DATABASE = process.env.DB_DATABASE || 'reniecsunat';
exports.DB_DATABASE = DB_DATABASE;
var DB_PORT = process.env.DB_PORT || 3306;
exports.DB_PORT = DB_PORT;
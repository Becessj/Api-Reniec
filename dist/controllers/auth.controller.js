"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = exports.login = void 0;
var _database = require("../database");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var login = exports.login = function login(req, res) {
  var _req$body = req.body,
    username = _req$body.username,
    password = _req$body.password;
  if (username && password && username !== "" && password !== "") {
    _database.dbConnection.query("SELECT * FROM users WHERE username=?", [username], function (err, rows, fields) {
      if (!err) {
        if (rows.length > 0) {
          _bcryptjs["default"].compare(password, rows[0].password, function (err, result) {
            if (err) {
              return res.status(500).json({
                message: "Error in server while comparing passwords"
              });
            }
            if (result) {
              var token = _jsonwebtoken["default"].sign({
                id: rows[0].id,
                tipo: rows[0].tipo
              }, "shh", {
                expiresIn: 86400
              });
              return res.status(200).json({
                message: "Logged in",
                token: token,
                user: {
                  id: rows[0].id,
                  nombre: rows[0].nombre,
                  tipo: rows[0].tipo
                }
              });
            } else {
              return res.status(401).json({
                message: "Incorrect password"
              });
            }
          });
        } else {
          return res.status(400).json({
            message: "Incorrect data or user does not exist. Please sign up.",
            token: null
          });
        }
      } else {
        console.error(err);
        return res.status(500).json({
          message: "Server error"
        });
      }
    });
  } else {
    return res.status(400).json({
      message: "Missing username or password. Please provide them and try again."
    });
  }
};
var signup = exports.signup = function signup(req, res) {
  var _req$body2 = req.body,
    username = _req$body2.username,
    password = _req$body2.password,
    nombre = _req$body2.nombre,
    tipo = _req$body2.tipo;
  if (username && password && nombre && tipo) {
    _database.dbConnection.query("SELECT * FROM users WHERE username=?", [username], function (err, rows, fields) {
      if (!err) {
        if (!rows.length > 0) {
          var passEncryptd = _bcryptjs["default"].hashSync(password, 10);
          _database.dbConnection.query("INSERT INTO users (username, password, nombre, tipo) VALUES (?, ?, ?, ?)", [username, passEncryptd, nombre, tipo], function (err) {
            if (!err) {
              return res.status(200).json({
                message: "Signup successfully. Login now1..."
              });
            } else {
              console.error(err);
              return res.status(400).json({
                message: "Error at signup",
                error: err
              });
            }
          });
        } else {
          res.status(400).json({
            message: "User exists"
          });
        }
      } else {
        console.error(err);
        return res.status(500).json({
          message: "Error in the server"
        });
      }
    });
  } else {
    return res.status(400).json({
      message: "Missing values. Please complete all fields and try again."
    });
  }
};
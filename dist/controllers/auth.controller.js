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
                message: "Error en el servidor al comparar contraseñas"
              });
            }
            if (result) {
              var token = _jsonwebtoken["default"].sign({
                id: rows[0].id
              }, "shh", {
                expiresIn: 86400
              });
              return res.status(200).json({
                message: "Logued",
                token: token
              });
            } else {
              return res.status(401).json({
                message: "Contraseña incorrecta"
              });
            }
          });
        } else {
          return res.status(400).json({
            message: "Datos incorrectos o no existe el usuario. En ese caso registrate...",
            token: null
          });
        }
      } else {
        console.error(err);
        return res.status(500).json({
          message: "Error en el servidor"
        });
      }
    });
  } else {
    return res.status(400).json({
      message: "Faltan los valores del username y/o del password o están sus valores vacíos. Ingréselos e inténtelo de nuevo"
    });
  }
};
var signup = exports.signup = function signup(req, res) {
  var _req$body2 = req.body,
    username = _req$body2.username,
    password = _req$body2.password;
  if (username && password && (username !== "" || password !== "")) {
    _database.dbConnection.query("SELECT * FROM users WHERE username=?", [username], function (err, rows, fields) {
      if (!err) {
        if (!rows.length > 0) {
          var passEncryptd = _bcryptjs["default"].hashSync(password, 10);
          _database.dbConnection.query("INSERT INTO users (username,password) VALUES(?,?)", [username, passEncryptd], function (err) {
            if (!err) {
              return res.status(200).json({
                message: "Singup succesfully. Login now..."
              });
            } else {
              console.error(err);
              return res.status(400).json({
                message: "Error at signup",
                errpr: err
              });
            }
          });
        } else {
          res.status(400).json({
            message: "User exists"
          });
        }
      }
    });
  } else {
    return res.json({
      message: "Faltan los valores del username y/o del password o estan sus valores vacios. Ingreselos e intentelo de nuevo"
    });
  }
};
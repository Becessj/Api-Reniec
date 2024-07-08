"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReniecSunat = exports.getReniecSunatById = exports.getAllReniecSunat = void 0;

var _database = require("../database");

var getAllReniecSunat = function getAllReniecSunat(req, res) {
  _database.dbConnection.query("SELECT * FROM documentos", function (err, rows) {
    if (!err) {
      return res.status(200).json({
        paises: rows
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error at get documentos",
        error: err
      });
    }
  });
};

exports.getAllReniecSunat = getAllReniecSunat;

var getReniecSunatById = function getReniecSunatById(req, res) {
  var id = req.params.id;

  _database.dbConnection.query("SELECT * FROM paises WHERE id = ?", [id], function (err, rows) {
    if (!err) {
      return res.status(200), json({
        pais: rows
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error at get pais with id " + id,
        error: err
      });
    }
  });
};

exports.getReniecSunatById = getReniecSunatById;

var createReniecSunat = function createReniecSunat(req, res) {
  var _req$body = req.body,
      nombre_oficial = _req$body.nombre_oficial,
      nombre_comun = _req$body.nombre_comun,
      fechaCreacion = _req$body.fechaCreacion,
      capital = _req$body.capital,
      idioma_oficial = _req$body.idioma_oficial,
      gentilico = _req$body.gentilico,
      moneda = _req$body.moneda,
      continente = _req$body.continente,
      extension = _req$body.extension,
      link_img = _req$body.link_img;

  _database.dbConnection.query("INSERT INTO paises ( nombre_oficial, nombre_comun,link_img, fechaCreacion, capital, idioma_oficial, gentilico, moneda, continente, extension) VALUES(?,?,?,?,?,?,?,?,?)", [nombre_oficial, nombre_comun, fechaCreacion, capital, idioma_oficial, gentilico, moneda, continente, extension, link_img], function (err, rows) {
    if (!err) {
      return res.status(201).json({
        message: "Pais saved",
        paisCreated: {
          nombre_oficial: nombre_oficial,
          nombre_comun: nombre_comun,
          fechaCreacion: fechaCreacion,
          capital: capital,
          idioma_oficial: idioma_oficial,
          gentilico: gentilico,
          moneda: moneda,
          continente: continente,
          extension: extension,
          link_img: link_img
        }
      });
    } else {
      console.error(err);
      return res.status(400), json({
        message: "Error at save pais",
        error: err
      });
    }
  });
};

exports.createReniecSunat = createReniecSunat;
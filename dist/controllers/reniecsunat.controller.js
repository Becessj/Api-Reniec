"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReniecSunat = exports.getReniecSunatById = exports.getAllReniecSunat = void 0;

var _database = require("../database");

var getAllReniecSunat = function getAllReniecSunat(req, res) {
  _database.dbConnection.query("SELECT * FROM documento_identidad", function (err, rows) {
    if (!err) {
      return res.status(200).json({
        documentos: rows
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error at get reniec sunat",
        error: err
      });
    }
  });
};

exports.getAllReniecSunat = getAllReniecSunat;

var getReniecSunatById = function getReniecSunatById(req, res) {
  var id = req.body.id;

  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc=?", [id], function (err, rows, fields) {
    if (rows.length <= 0) return res.status(200).json({
      message: "Documento not found"
    });

    if (!err) {
      // console.log(rows[0]['nombres']);
      return res.status(200).json(rows[0]);
    } else {
      console.error(err);
      return res.status(500).json({
        message: "Error en el servidor"
      });
    }
  });
};

exports.getReniecSunatById = getReniecSunatById;

var createReniecSunat = function createReniecSunat(req, res) {
  var _req$body = req.body,
      nro_doc = _req$body.nro_doc,
      tipo_doc = _req$body.tipo_doc,
      nro_doc_txt = _req$body.nro_doc_txt,
      nombres = _req$body.nombres,
      ap = _req$body.ap,
      am = _req$body.am,
      razon_s = _req$body.razon_s,
      estado = _req$body.estado,
      condicion = _req$body.condicion,
      direccion = _req$body.direccion,
      departamento = _req$body.departamento,
      provincia = _req$body.provincia,
      distrito = _req$body.distrito,
      fecharegistro = _req$body.fecharegistro;

  _database.dbConnection.query("INSERT INTO documento_identidad (nro_doc,tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion,direccion,departamento,provincia,distrito,fecharegistro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [nro_doc, tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion, direccion, departamento, provincia, distrito, fecharegistro], function (err, rows) {
    if (!err) {
      return res.status(201).json({
        message: "Document saved"
      });
    } else {
      console.error(err);
      return res.status(400), json({
        message: "Error at save document",
        error: err
      });
    }
  });
};

exports.createReniecSunat = createReniecSunat;
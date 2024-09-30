"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReniecSunatByIdApis = exports.getReniecSunatById = exports.getAllReniecSunat = exports.createReniecSunat = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _database = require("../database");
var _axios = _interopRequireDefault(require("axios"));
// Obtener todos los documentos de la base de datos
var getAllReniecSunat = exports.getAllReniecSunat = function getAllReniecSunat(req, res) {
  _database.dbConnection.query("SELECT * FROM documento_identidad", function (err, rows) {
    if (!err) {
      return res.status(200).json({
        documentos: rows
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error al obtener documentos de reniec sunat",
        error: err
      });
    }
  });
};
var getReniecSunatByIdApis = exports.getReniecSunatByIdApis = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var dni, response, reniecData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          dni = req.body.numero; // Validar que el DNI tenga al menos 8 dígitos
          if (!(!dni || dni.length < 8)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: "El DNI debe tener al menos 8 dígitos."
          }));
        case 3:
          console.log('DNI recibido desde el cuerpo:', dni);
          _context.prev = 4;
          _context.next = 7;
          return _axios["default"].get("https://api.apis.net.pe/v2/reniec/dni?numero=".concat(dni), {
            headers: {
              Authorization: "Bearer apis-token-9389.WDi7ib91foCGt-Pk7ST4SgD3LEalekx5"
            }
          });
        case 7:
          response = _context.sent;
          reniecData = response.data;
          if (!reniecData) {
            _context.next = 15;
            break;
          }
          console.log('Datos de RENIEC:', reniecData);

          // Insertar los datos en la base de datos sin retornar nada
          createReniecSunat(req, reniecData);

          // Retornar solo los datos al cliente
          return _context.abrupt("return", res.status(200).json(reniecData));
        case 15:
          return _context.abrupt("return", res.status(404).json({
            error: "Datos no encontrados."
          }));
        case 16:
          _context.next = 22;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](4);
          console.error('Error al procesar la solicitud a la API de RENIEC:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            error: 'Error al procesar la solicitud a la API de RENIEC'
          }));
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 18]]);
  }));
  return function getReniecSunatByIdApis(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
// Obtener un documento de la base de datos por ID
var getReniecSunatById = exports.getReniecSunatById = function getReniecSunatById(req, res) {
  var id = req.body.id;
  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc=?", [id], function (err, rows, fields) {
    if (rows.length <= 0) return res.status(404).json({
      message: "Documento no encontrado"
    });
    if (!err) {
      return res.status(200).json(rows[0]);
    } else {
      console.error(err);
      return res.status(500).json({
        message: "Error en el servidor"
      });
    }
  });
};

// Crear un nuevo documento en la base de datos sin retornar nada
var createReniecSunat = exports.createReniecSunat = function createReniecSunat(req, reniecData) {
  console.log('Datos que se están insertando en la BD:', reniecData);
  var nro_doc = reniecData.numeroDocumento,
    nombres = reniecData.nombres,
    ap = reniecData.apellidoPaterno,
    am = reniecData.apellidoMaterno,
    direccion = reniecData.direccion,
    departamento = reniecData.departamento,
    provincia = reniecData.provincia,
    distrito = reniecData.distrito;
  var _req$body = req.body,
    tipo_doc = _req$body.tipo_doc,
    nro_doc_txt = _req$body.nro_doc_txt,
    razon_s = _req$body.razon_s,
    estado = _req$body.estado,
    condicion = _req$body.condicion,
    fecharegistro = _req$body.fecharegistro;

  // Verificar si el documento ya existe
  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc = ?", [nro_doc], function (err, rows) {
    if (err) {
      console.error('Error al verificar si el documento existe:', err);
      return;
    }
    if (rows.length > 0) {
      console.log('Documento ya existe en la base de datos.');
      return; // Salir si ya existe
    }

    // Si no existe, proceder a insertar
    _database.dbConnection.query("INSERT INTO documento_identidad (nro_doc, tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion, direccion, departamento, provincia, distrito, fecharegistro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [nro_doc, tipo_doc || '', nro_doc_txt || '', nombres, ap, am, razon_s || '', estado || '', condicion || '', direccion || '', departamento || '', provincia || '', distrito || '', fecharegistro || new Date()], function (insertErr) {
      if (insertErr) {
        console.error('Error al guardar en la BD:', insertErr);
      } else {
        console.log("Documento almacenado correctamente");
      }
    });
  });
};
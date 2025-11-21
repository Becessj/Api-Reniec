"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTipoCambioSunat = exports.getRucSmart = exports.getRucFullSmart = exports.getReniecSunatByIdApis = exports.getReniecSunatById = exports.getDniSmart = exports.getAllReniecSunat = exports.createRucSunat = exports.createReniecSunat = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _database = require("../database");
var _axios = _interopRequireDefault(require("axios"));
var getDniSmart = exports.getDniSmart = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var dni;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          dni = req.body.numero;
          if (!(!dni || dni.length < 8)) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            error: "El DNI debe tener al menos 8 dígitos."
          }));
        case 3:
          // 1) Buscar primero en tu BD
          _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc=?", [dni], /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(err, rows) {
              var response, reniecData;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 3;
                      break;
                    }
                    console.error(err);
                    return _context.abrupt("return", res.status(500).json({
                      message: "Error en el servidor"
                    }));
                  case 3:
                    if (!(rows.length > 0)) {
                      _context.next = 5;
                      break;
                    }
                    return _context.abrupt("return", res.status(200).json(rows[0]));
                  case 5:
                    _context.prev = 5;
                    _context.next = 8;
                    return _axios["default"].get("https://api.apis.net.pe/v2/reniec/dni?numero=".concat(dni), {
                      headers: {
                        Authorization: "Bearer ".concat(process.env.RENIEC_API_TOKEN)
                      }
                    });
                  case 8:
                    response = _context.sent;
                    reniecData = response.data;
                    if (reniecData) {
                      _context.next = 12;
                      break;
                    }
                    return _context.abrupt("return", res.status(404).json({
                      error: "Datos no encontrados."
                    }));
                  case 12:
                    // Guardar en BD (si no existe — tu función ya valida)
                    createReniecSunat(req, reniecData);

                    // Devolver datos de RENIEC
                    return _context.abrupt("return", res.status(200).json(reniecData));
                  case 16:
                    _context.prev = 16;
                    _context.t0 = _context["catch"](5);
                    console.error("Error API RENIEC:", _context.t0);
                    return _context.abrupt("return", res.status(500).json({
                      error: "Error al procesar la solicitud a la API de RENIEC"
                    }));
                  case 20:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[5, 16]]);
            }));
            return function (_x3, _x4) {
              return _ref2.apply(this, arguments);
            };
          }());
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getDniSmart(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

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
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var dni, response, reniecData;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          dni = req.body.numero; // Validar que el DNI tenga al menos 8 dígitos
          if (!(!dni || dni.length < 8)) {
            _context3.next = 3;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: "El DNI debe tener al menos 8 dígitos."
          }));
        case 3:
          console.log('DNI recibido desde el cuerpo:', dni);
          _context3.prev = 4;
          _context3.next = 7;
          return _axios["default"].get("https://api.apis.net.pe/v2/reniec/dni?numero=".concat(dni), {
            headers: {
              Authorization: "Bearer ".concat(process.env.RENIEC_API_TOKEN)
            }
          });
        case 7:
          response = _context3.sent;
          reniecData = response.data;
          if (!reniecData) {
            _context3.next = 15;
            break;
          }
          console.log('Datos de RENIEC:', reniecData);

          // Insertar los datos en la base de datos sin retornar nada
          createReniecSunat(req, reniecData);

          // Retornar solo los datos al cliente
          return _context3.abrupt("return", res.status(200).json(reniecData));
        case 15:
          return _context3.abrupt("return", res.status(404).json({
            error: "Datos no encontrados."
          }));
        case 16:
          _context3.next = 22;
          break;
        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](4);
          console.error('Error al procesar la solicitud a la API de RENIEC:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Error al procesar la solicitud a la API de RENIEC'
          }));
        case 22:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[4, 18]]);
  }));
  return function getReniecSunatByIdApis(_x5, _x6) {
    return _ref3.apply(this, arguments);
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

// Crear / actualizar un RUC en la base de datos
var createRucSunat = exports.createRucSunat = function createRucSunat(req, rucData) {
  console.log("Datos RUC que se están insertando en la BD:", rucData);
  var nro_doc = rucData.numero_documento,
    razon_social = rucData.razon_social,
    estado = rucData.estado,
    condicion = rucData.condicion,
    direccion = rucData.direccion,
    departamento = rucData.departamento,
    provincia = rucData.provincia,
    distrito = rucData.distrito;

  // Van opcionales desde el body, por si quieres distinguir tipo_doc, etc.
  var _req$body2 = req.body,
    tipo_doc = _req$body2.tipo_doc,
    nro_doc_txt = _req$body2.nro_doc_txt,
    fecharegistro = _req$body2.fecharegistro;
  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc = ?", [nro_doc], function (err, rows) {
    if (err) {
      console.error("Error al verificar si el RUC existe:", err);
      return;
    }
    if (rows.length > 0) {
      console.log("RUC ya existe en la base de datos.");
      return; // salir si ya existe
    }
    _database.dbConnection.query("INSERT INTO documento_identidad \n         (nro_doc, tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion, \n          direccion, departamento, provincia, distrito, fecharegistro)\n         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [nro_doc, tipo_doc || "RUC", nro_doc_txt || "", "",
    // nombres (no aplica para RUC)
    "",
    // ap
    "",
    // am
    razon_social || "", estado || "", condicion || "", direccion || "", departamento || "", provincia || "", distrito || "", fecharegistro || new Date()], function (insertErr) {
      if (insertErr) {
        console.error("Error al guardar RUC en la BD:", insertErr);
      } else {
        console.log("RUC almacenado correctamente");
      }
    });
  });
};
var getRucSmart = exports.getRucSmart = function getRucSmart(req, res) {
  var ruc = req.body.numero;
  if (!ruc || ruc.length !== 11) {
    return res.status(400).json({
      error: "El RUC debe tener exactamente 11 dígitos."
    });
  }

  // 1) Buscar primero en BD
  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc = ?", [ruc], /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(err, rows) {
      var response, rucData, _error$response, _error$response2, _error$response3;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!err) {
              _context4.next = 3;
              break;
            }
            console.error("Error BD en getRucSmart:", err);
            return _context4.abrupt("return", res.status(500).json({
              message: "Error en el servidor"
            }));
          case 3:
            if (!(rows.length > 0)) {
              _context4.next = 6;
              break;
            }
            console.log("RUC obtenido desde BD");
            return _context4.abrupt("return", res.status(200).json(rows[0]));
          case 6:
            _context4.prev = 6;
            _context4.next = 9;
            return _axios["default"].get("https://api.decolecta.com/v1/sunat/ruc?numero=".concat(ruc), {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(process.env.DECOLECTA_API_TOKEN)
              }
            });
          case 9:
            response = _context4.sent;
            rucData = response.data;
            console.log("Datos de SUNAT (básico) desde API:", rucData);
            if (rucData) {
              _context4.next = 14;
              break;
            }
            return _context4.abrupt("return", res.status(404).json({
              error: "Datos no encontrados."
            }));
          case 14:
            // Guardar en BD
            createRucSunat(req, rucData);

            // Devolver datos tal cual vienen de la API
            return _context4.abrupt("return", res.status(200).json(rucData));
          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](6);
            console.error("Error al procesar la solicitud a la API de SUNAT (RUC):", ((_error$response = _context4.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.data) || _context4.t0.message);
            return _context4.abrupt("return", res.status(((_error$response2 = _context4.t0.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) || 500).json({
              error: "Error al procesar la solicitud a la API de SUNAT (RUC)",
              detail: ((_error$response3 = _context4.t0.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data) || _context4.t0.message
            }));
          case 22:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[6, 18]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
};
var getRucFullSmart = exports.getRucFullSmart = function getRucFullSmart(req, res) {
  var ruc = req.body.numero;
  if (!ruc || ruc.length !== 11) {
    return res.status(400).json({
      error: "El RUC debe tener exactamente 11 dígitos."
    });
  }

  // 1) Buscar primero en BD
  _database.dbConnection.query("SELECT * FROM documento_identidad WHERE nro_doc = ?", [ruc], /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(err, rows) {
      var response, rucData, _error$response4, _error$response5, _error$response6;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!err) {
              _context5.next = 3;
              break;
            }
            console.error("Error BD en getRucFullSmart:", err);
            return _context5.abrupt("return", res.status(500).json({
              message: "Error en el servidor"
            }));
          case 3:
            if (!(rows.length > 0)) {
              _context5.next = 6;
              break;
            }
            console.log("RUC FULL obtenido desde BD");
            return _context5.abrupt("return", res.status(200).json(rows[0]));
          case 6:
            _context5.prev = 6;
            _context5.next = 9;
            return _axios["default"].get("https://api.decolecta.com/v1/sunat/ruc/full?numero=".concat(ruc), {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer sk_11787.GcOGlULNYudTVOjeqmktrzAmVBYdr2WU" // o process.env.DECOLECTA_TOKEN
              }
            });
          case 9:
            response = _context5.sent;
            rucData = response.data;
            console.log("Datos de SUNAT (full) desde API:", rucData);
            if (rucData) {
              _context5.next = 14;
              break;
            }
            return _context5.abrupt("return", res.status(404).json({
              error: "Datos no encontrados."
            }));
          case 14:
            // Guardar en BD (mismos campos básicos)
            createRucSunat(req, rucData);

            // Devolver datos full
            return _context5.abrupt("return", res.status(200).json(rucData));
          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](6);
            console.error("Error al procesar la solicitud a la API de SUNAT (RUC full):", ((_error$response4 = _context5.t0.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data) || _context5.t0.message);
            return _context5.abrupt("return", res.status(((_error$response5 = _context5.t0.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.status) || 500).json({
              error: "Error al procesar la solicitud a la API de SUNAT (RUC full)",
              detail: ((_error$response6 = _context5.t0.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data) || _context5.t0.message
            }));
          case 22:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[6, 18]]);
    }));
    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());
};
// ===============================
// TIPO DE CAMBIO SUNAT (DECOLECTA)
// ===============================
var getTipoCambioSunat = exports.getTipoCambioSunat = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$query, date, month, year, params, response, data, _error$response7, _error$response8, _error$response9;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query = req.query, date = _req$query.date, month = _req$query.month, year = _req$query.year; // Construir los parámetros para la API de Decolecta
          params = {}; // Filtro por fecha específica (YYYY-MM-DD)
          if (date) {
            params.date = date;
          }

          // Filtro mensual: si viene month, debe venir year
          if (!month) {
            _context6.next = 9;
            break;
          }
          if (year) {
            _context6.next = 7;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            error: "Si envías 'month' debes enviar también 'year'."
          }));
        case 7:
          params.month = month;
          params.year = year;
        case 9:
          _context6.next = 11;
          return _axios["default"].get("https://api.decolecta.com/v1/tipo-cambio/sunat", {
            params: params,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(process.env.DECOLECTA_API_TOKEN)
            }
          });
        case 11:
          response = _context6.sent;
          data = response.data; // Ejemplo de respuesta esperada:
          // {
          //   "buy_price": "3.540",
          //   "sell_price": "3.552",
          //   "base_currency": "USD",
          //   "quote_currency": "PEN",
          //   "date": "2025-07-26"
          // }
          return _context6.abrupt("return", res.status(200).json(data));
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          console.error("Error al consultar tipo de cambio SUNAT:", ((_error$response7 = _context6.t0.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.data) || _context6.t0.message);
          return _context6.abrupt("return", res.status(((_error$response8 = _context6.t0.response) === null || _error$response8 === void 0 ? void 0 : _error$response8.status) || 500).json({
            error: "Error al consultar el tipo de cambio de SUNAT",
            detail: ((_error$response9 = _context6.t0.response) === null || _error$response9 === void 0 ? void 0 : _error$response9.data) || _context6.t0.message
          }));
        case 20:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 16]]);
  }));
  return function getTipoCambioSunat(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
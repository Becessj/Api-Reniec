"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _reniecsunat = require("../controllers/reniecsunat.controller");
var _auth = require("../controllers/auth.controller");
var _verifyToken = _interopRequireDefault(require("../middlewares/verifyToken.middleware"));
var router = (0, _express.Router)();

// Redirige la raíz a documentos
router.get("/", function (req, res) {
  return res.redirect("/api/documentos");
});

// Rutas de autenticación
router.post("/api/login", _auth.login);
router.post("/api/signup", _auth.signup);

// Rutas para manejar documentos
router.route("/api/documentos").get(_verifyToken["default"], _reniecsunat.getAllReniecSunat).post(_verifyToken["default"], _reniecsunat.createReniecSunat);

// Ruta para consultar DNI usando la API RENIEC
router.route("/api/dniApi/").post(_verifyToken["default"], _reniecsunat.getReniecSunatByIdApis); // Esta ruta está bien configurada

// Ruta para consultar DNI
router.route("/api/dni/").post(_verifyToken["default"], _reniecsunat.getReniecSunatById);

// Ruta para RUC básico (smart)
router.route("/api/ruc/").post(_verifyToken["default"], _reniecsunat.getRucSmart);

// Ruta para RUC full (smart)
router.route("/api/ruc/full/").post(_verifyToken["default"], _reniecsunat.getRucFullSmart);
var _default = exports["default"] = router;
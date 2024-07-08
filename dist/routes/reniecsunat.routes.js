"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _documentos = require("../controllers/reniecsunat.controller");

var _auth = require("../controllers/auth.controller");

var _verifyToken = _interopRequireDefault(require("../middlewares/verifyToken.middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.get("/", function (req, res) {
  return res.redirect("/api/documentos");
});
router.post("/api/login", _auth.login);
router.post("/api/signup", _auth.signup);
router.route("/api/documentos").get(_verifyToken["default"], _documentos.getAlldocumentos).post(_verifyToken["default"], _documentos.createPais);
router.route("/api/documento/:id").get(_verifyToken["default"], _documentos.getPaisById).put(_verifyToken["default"], _documentos.updatePais)["delete"](_verifyToken["default"], _documentos.deletePais);
var _default = router;
exports["default"] = _default;
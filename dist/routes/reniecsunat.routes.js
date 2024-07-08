"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _reniecsunat = require("../controllers/reniecsunat.controller");

var _auth = require("../controllers/auth.controller");

var _verifyToken = _interopRequireDefault(require("../middlewares/verifyToken.middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.get("/", function (req, res) {
  return res.redirect("/api/documentos");
});
router.post("/api/login", _auth.login);
router.post("/api/signup", _auth.signup);
router.route("/api/documentos").get(_verifyToken["default"], _reniecsunat.getAllReniecSunat).post(_verifyToken["default"], _reniecsunat.createReniecSunat);
router.route("/api/dni/").post(_verifyToken["default"], _reniecsunat.getReniecSunatById);
router.route("/api/ruc/").post(_verifyToken["default"], _reniecsunat.getReniecSunatById);
var _default = router;
exports["default"] = _default;
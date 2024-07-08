"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _helmet = _interopRequireDefault(require("helmet"));

var _reniecsunat = _interopRequireDefault(require("./routes/reniecsunat.routes"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Initializations
_dotenv["default"].config();

var app = (0, _express["default"])(); // Settings

app.set("port", process.env.PORT || 3000); // Middlewares

app.use((0, _cors["default"])());
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
})); // Routes

app.use(_reniecsunat["default"]);
var _default = app;
exports["default"] = _default;
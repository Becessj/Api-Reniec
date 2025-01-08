"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _helmet = _interopRequireDefault(require("helmet"));
var _reniecsunat = _interopRequireDefault(require("./routes/reniecsunat.routes"));
var _morgan = _interopRequireDefault(require("morgan"));
var _config = require("./config");
// Initializations
_dotenv["default"].config();
var app = (0, _express["default"])();

// Settings
app.set("port", process.env.PORT || 3000);

// CORS Configuration
var corsOptions = {
  origin: ['*',
  // Permitir a todos los orígenes
  'http://localhost:8082', 'https://transformaciondigital.guamanpoma.org', 'https://santiagolimpio.guamanpoma.org', 'http://localhost:3000', 'http://infoserver1:8082'],
  // Lista de orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
};

// Middlewares
app.use((0, _cors["default"])(corsOptions)); // Aplicar CORS con las opciones configuradas
app.use((0, _helmet["default"])()); // Helmet para mejorar la seguridad
app.use((0, _morgan["default"])("dev")); // Morgan para el logging de las solicitudes
app.use(_express["default"].json()); // Para manejar JSON
app.use(_express["default"].urlencoded({
  extended: false
})); // Para manejar datos codificados en URL

// Routes
app.use(_reniecsunat["default"]);

// Starting the server
app.listen(_config.PORT, function () {
  console.log("Server on port", _config.PORT);
});
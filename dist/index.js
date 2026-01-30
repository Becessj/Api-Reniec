"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _helmet = _interopRequireDefault(require("helmet"));
var _reniecsunat = _interopRequireDefault(require("./routes/reniecsunat.routes"));
var _morgan = _interopRequireDefault(require("morgan"));
var _config = require("./config");
// ==============================
// Initializations
// ==============================
_dotenv["default"].config();
var app = (0, _express["default"])();

// ==============================
// Settings
// ==============================
app.set("port", process.env.PORT || 3000);

// ==============================
// CORS – ORÍGENES PERMITIDOS
// ==============================
var allowedOrigins = [
// Local
"http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8082", "http://localhost:8083",
// IPs internas
"http://10.0.0.216:8080", "http://10.0.0.216:8083", "http://10.0.0.193:8082",
// IP pública directa
"http://190.234.243.220:8080",
// Dominios institucionales
"https://transformaciondigitalcusco.in", "https://santiagomedioambiente.transformaciondigitalcusco.in", "https://tramitedocumentario.transformaciondigitalcusco.in", "https://santiagolimpio.transformaciondigitalcusco.in",
// Dominios Guaman Poma
"https://transformaciondigital.guamanpoma.org", "https://santiagolimpio.guamanpoma.org", "https://especializacionseguridadalimentaria.guamanpoma.org"];

// ==============================
// Middlewares
// ==============================
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    // Permitir requests sin origin (Postman, server-to-server, cron, etc.)
    if (!_origin) return callback(null, true);
    if (allowedOrigins.includes(_origin)) {
      return callback(null, true);
    }
    console.error("❌ CORS bloqueado para:", _origin);
    return callback(new Error("Not allowed by CORS: " + _origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  credentials: false
}));

// Responder correctamente a preflight
app.options("*", (0, _cors["default"])());
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));

// ==============================
// Routes
// ==============================
app.use(_reniecsunat["default"]);

// ==============================
// Start server
// ==============================
app.listen(_config.PORT, function () {
  console.log("✅ API Reniec/Sunat corriendo en puerto", _config.PORT);
});
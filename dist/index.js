"use strict";

var _app = _interopRequireDefault(require("./app"));

var _config = require("./config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Starting the server
_app["default"].listen(_config.PORT, function () {
  console.log("Server on port", _config.PORT);
});
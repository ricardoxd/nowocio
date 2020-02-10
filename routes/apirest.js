var express = require('express');
var router = express.Router();
var usuario = require('./usuarioapi')
var reporte = require('./reporteapi');
router.use("/reporte",reporte);
router.use("/usuario",usuario);

module.exports = router;


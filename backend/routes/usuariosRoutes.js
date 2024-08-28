const express = require('express');
const usuariosController = require('../controllers/usuarioController.js');
const router = express.Router();
router.get('/usuarios', usuariosController.getAllUsuarios);
module.exports = router;

const express = require('express');
const usuariosController = require('../controllers/usuarioController.js');
const router = express.Router();
router.get('/verUsuarios', usuariosController.getAllUsuarios);
router.get('/verUsuario/:id', usuariosController.getUsuarioById);
router.post('/crearUsuario', usuariosController.createUsuario);
router.put('/actualizarUsuario/:id', usuariosController.updateUsuario);
router.delete('/borrarUsuario/:id', usuariosController.deleteUsuario);
module.exports = router;

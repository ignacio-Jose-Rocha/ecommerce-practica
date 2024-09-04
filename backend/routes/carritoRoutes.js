const express = require('express');
const carritoController = require('../controllers/carritoController.js');
const router = express.Router();

router.get('/verCarrito', carritoController.getAllCarrito);
router.get('/verCarrito/:id', carritoController.getCarritoById);
router.post('/crearCarrito', carritoController.crearCarrito);
router.put('/actualizarCarrito/:id', carritoController.editarCarrito);
router.delete('/borrarCarrito/:id', carritoController.eliminarCarrito);
module.exports = router;
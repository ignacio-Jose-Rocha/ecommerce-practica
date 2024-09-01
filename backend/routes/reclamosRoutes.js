const express = require('express');
const reclamosController = require('../controllers/reclamosController.js');
const router = express.Router();
router.get('/verReclamos', reclamosController.getAllReclamos);
router.get('/verReclamo/:id', reclamosController.getReclamoById);
router.post('/crearReclamo', reclamosController.createReclamo);
router.put('/actualizarReclamo/:id', reclamosController.actualizarReclamo);
module.exports = router;

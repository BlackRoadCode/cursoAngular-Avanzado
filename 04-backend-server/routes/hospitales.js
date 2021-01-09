/** Ruta: /api/hospitales  */

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Consultar hospitales
router.get( '/' , getHospitales );

// Crear hospital
router.post( '/', 
[] , crearHospital );

// Actualizar hospital
router.put( '/:id', 
[], actualizarHospital );

// Borrar hospital
router.delete( '/:id', borrarHospital );

module.exports = router;
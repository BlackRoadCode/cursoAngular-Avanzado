/** Ruta: /api/hospitales  */

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Consultar hospitales
router.get( '/' , validarJWT , getHospitales );

// Crear hospital
router.post( '/', 
[
    validarJWT,
    check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
    validarCampos
] , crearHospital );

// Actualizar hospital
router.put( '/:id', 
[
    validarJWT,
    check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
    validarCampos
], actualizarHospital );

// Borrar hospital
router.delete( '/:id', validarJWT , borrarHospital );

module.exports = router;
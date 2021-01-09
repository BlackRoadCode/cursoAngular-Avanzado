/** Ruta: /api/medicos  */

const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico} = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Consultar medicos
router.get( '/' , validarJWT, getMedicos );

// Crear medico
router.post( '/', 
[
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio.').not().isEmpty(),
    check('hospital', 'El id del hospital no es válido.').isMongoId(),
    validarCampos
] , crearMedico );

// Actualizar medico
router.put( '/:id', 
[], actualizarMedico );

// Borrar medico
router.delete( '/:id', borrarMedico );

module.exports = router;

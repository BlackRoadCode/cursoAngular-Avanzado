/** Ruta: /api/todo/:termino  */

const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Consultar hospitales
router.get( '/:termino' , validarJWT , getAll );
router.get( '/coleccion/:tabla/:termino' , validarJWT , getDocumentosColeccion );

module.exports = router;
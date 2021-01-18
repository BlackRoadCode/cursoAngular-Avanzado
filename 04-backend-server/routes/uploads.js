/** Ruta: /api/uploads/:tipo/:id  */

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const expressFileUpload = require('express-fileupload');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.use( expressFileUpload() );

// Cargar archivos
router.put( '/:tipo/:id' , validarJWT , fileUpload );
router.get( '/:tipo/:imagen', retornaImagen );

module.exports = router;
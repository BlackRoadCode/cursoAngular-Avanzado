
/** Ruta: /api/usuarios  */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarAdminRole, validarAdminRoleOMismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

// Consultar usuarios
router.get( '/', validarJWT , getUsuarios );

// Crear usuario
router.post( '/', 
[
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('password', 'El campo password es obligatorio').not().isEmpty(),
    check('email', 'El campo email es obligatorio').isEmail(),
    validarCampos,
] , crearUsuario );

// Actualizar usuario
router.put( '/:id', 
[
    validarJWT, 
    validarAdminRoleOMismoUsuario,
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('email', 'El campo email es obligatorio').isEmail(),
    check('role', 'El campo rol es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuario );

// Borrar Usuario
router.delete( '/:id', [ validarJWT, validarAdminRole ] , borrarUsuario );

module.exports = router;
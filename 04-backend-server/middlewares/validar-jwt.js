
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = ( req, res, next ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            ok:false,
            msg:'No existe un JWT válido.'
        });   
     }

     try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        next();

     } catch (error) {
         console.log(error);
         return res.status(401).json({
             ok:false,
            msg: 'JWT no válido.'
         });
     }

}

const validarAdminRole = async( req, res, next ) =>{

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario en la base de datos'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' ){
            return res.status(403).json({
                ok: false,
                msg: 'No cuenta con los permisos necesarios para hacer eso.'
            });
        }

        next();
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Error al procesar la solicitud en middleware role'
        });
    }

}

const validarAdminRoleOMismoUsuario = async( req, res, next ) =>{

    const uid = req.uid;
    const idToUpdate = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario en la base de datos'
            });
        }

        if ( usuarioDB.role === 'ADMIN_ROLE' || uid === idToUpdate ){
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No cuenta con los permisos necesarios para hacer eso.'
            });
        }
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Error al procesar la solicitud en middleware role'
        });
    }

}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRoleOMismoUsuario
}
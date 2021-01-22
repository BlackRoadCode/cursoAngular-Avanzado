
const { response } = require('express');
const bcrypt  = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');


const login = async( req, res = response ) =>{

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        // Verificar Email
        if ( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'Email o contraseña no válidos'
            });
        }
 
        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o email no válidos'
            })
        }

        // Generar el token - JWT
        const token = await generarJWT( usuarioDB.id );


        res.status(200).json({
            ok: true,
            token,
            menu: getMenuFrontend( usuarioDB.role )
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error indeterminado.'
        })
    }
}

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        // Validar si el usuario (email) existe en la base de datos
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if( !usuarioDB ){
            // Si el usuario no existe crear uno nuevo
            usuario = new Usuario({
                nombre:name,
                email,
                password: '@@@',
                img:picture,
                google:true
            });
        } else {
            // Existe el usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar usuario en BD
        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            ok: true,
            msg: 'Google Sign-in',
            token,
            menu: getMenuFrontend( usuario.role )
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

}

const renewToken = async( req, res = response ) =>{

    const uid = req.uid;

    // Generar el token - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario al que corresponde el uid
    const user = await Usuario.findById(uid);

    res.status(200).json({
        ok:true,
        token,
        user,
        menu: getMenuFrontend( user.role )
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}
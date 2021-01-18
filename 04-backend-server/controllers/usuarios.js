
const { response } = require('express');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario.find({}, 'nombre email role google').skip(desde).limit( 5 );
    // const total = await Usuario.count();

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img').skip(desde).limit( 5 ),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        uid:req.uid,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password, nombre } = req.body;

    try {

        const existeEmail = await Usuario.findOne( { email } );

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg:'El correo electrónico existe en la BD'
            })
        }

        const usuario = new Usuario(req.body);
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
        // Crear token
        const token = await generarJWT( usuario.id );

        await usuario.save();

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        })
    }

}

const actualizarUsuario = async( req, res = response ) =>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg:'No existe el usuario.'
            });
        }

        // Actualizar registro
        const { password, google, email, ...campos} = req.body;

        if( usuarioDB.email != email ){
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo electrónico ya existe en la base de datos.'
                });
            }
        }

        if( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'No es posible modificar tu correo si eres usuario de Google.'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new:true } );

        res.json({
            ok:true,
            usuario:usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar usuario'
        })
    }
}

const borrarUsuario = async( req, res = response ) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg:'No existe el usuario.'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        return res.status(200).json({
            ok: true,
            msg: 'Registro eliminado de la base de datos.'
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error al borrar el usuario'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
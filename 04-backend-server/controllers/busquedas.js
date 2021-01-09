
const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getAll = async ( req, res = response ) => {

    const termino = req.params.termino;
    const regex = new RegExp( termino, 'i' );

    // const usuarios = await Usuario.find({ nombre:regex }); // Búsqueda de ejemplo

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre:regex }),
        Medico.find({ nombre:regex }),
        Hospital.find({ nombre:regex })
    ]);


    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosColeccion = async ( req, res = response ) => {

    const termino = req.params.termino;
    const tabla = req.params.tabla;
    const regex = new RegExp( termino, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre:regex }).populate( 'usuario', 'nombre img' ).populate( 'hospital', 'nombre img' );
        break;
        
        case 'hospitales':
            data = await Hospital.find({ nombre:regex }).populate( 'usuario', 'nombre img' );
        break;
        
        case 'usuarios':
            data = await Usuario.find({ nombre:regex });
        break;
            
        default:
            return res.status(400).json({
                ok:false,
                msg:'La colección ingresada no existe'
            });
        break;
    }

    res.status(200).json({
        ok:true,
        resultados:data
    });
}

module.exports = {
    getAll,
    getDocumentosColeccion
}
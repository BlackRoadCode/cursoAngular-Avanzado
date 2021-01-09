
const { response } = require('express');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Medico = require('../models/medico');

const getMedicos = async ( req, res = response ) => {

    // const medicos = await Medico.find({}, 'nombre img usuario hospital');
    const medicos = await Medico.find().populate( 'usuario', 'nombre img' ).populate( 'hospital', 'nombre img' );

    res.json({
        ok: true,
        medicos 
    });
}

const crearMedico = async (req, res = response) => {
    
    const uid = req.uid;

    const medico = new Medico( {
        usuario:uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok:true,
            medico:medicoDB
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al crear un medico'
        });
        
    }
    
}

const actualizarMedico = async( req, res = response ) =>{
    res.json({
        ok:true,
        msg: 'actualizarMedico'
    });
}

const borrarMedico = async( req, res = response ) => {
    res.json({
        ok:true,
        msg: 'borrarMedico'
    });
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
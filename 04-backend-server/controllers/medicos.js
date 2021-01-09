
const { response } = require('express');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Medico = require('../models/medico');

const getMedicos = async ( req, res = response ) => {

    res.json({
        ok:true,
        msg: 'getMedicos'
    });
}

const crearMedico = async (req, res = response) => {
    res.json({
        ok:true,
        msg: 'crearMedico'
    });
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

const { response } = require('express');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Hospital = require('../models/hospital');

const getHospitales = async ( req, res = response ) => {

    res.json({
        ok:true,
        msg: 'getHospitales'
    });
}

const crearHospital = async (req, res = response) => {
    res.json({
        ok:true,
        msg: 'crearHospital'
    });
}

const actualizarHospital = async( req, res = response ) =>{
    res.json({
        ok:true,
        msg: 'actualizarHospital'
    });
}

const borrarHospital = async( req, res = response ) => {
    res.json({
        ok:true,
        msg: 'borrarHospital'
    });
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}

const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const hospital = require('../models/hospital');

const Hospital = require('../models/hospital');

const getHospitales = async ( req, res = response ) => {

    // const hospitales = await Hospital.find({}, 'nombre img usuario'); // Emulando la consulta de usuarios
    const hospitales = await Hospital.find().populate( 'usuario', 'nombre img' );

    res.json({
        ok: true,
        hospitales 
    });
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario:uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok:true,
            hospital:hospitalDB
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al crear un hospital'
        });
        
    }
    
}

const actualizarHospital = async( req, res = response ) =>{

    const  hospitalID = req.params.id;
    const uid = req.uid;

    try {
        
        const hospitalDB = await Hospital.findById( hospitalID );

        if ( !hospitalDB ){
            return res.status(404).json({
                ok:false,
                msg: 'Hospital no encontrado'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario:uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate( hospitalID, cambiosHospital, { new:true } );
        
        res.json({
            ok:true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el hospital'
        });
        
    }

}

const borrarHospital = async( req, res = response ) => {
    const  hospitalID = req.params.id;

    try {
        
        const hospitalDB = await Hospital.findById( hospitalID );

        if ( !hospitalDB ){
            return res.status(404).json({
                ok:false,
                msg: 'Hospital no encontrado'
            });
        }

        await Hospital.findByIdAndDelete( hospitalID );
        
        res.json({
            ok:true,
            msg: 'Hospital Eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el hospital'
        });
        
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
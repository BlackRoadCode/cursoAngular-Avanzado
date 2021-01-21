
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

const getMedico = async ( req, res = response ) => {

    // const medicos = await Medico.find({}, 'nombre img usuario hospital');
    
    try {
        const medico = await Medico.findById( req.params.id ).populate( 'usuario', 'nombre img' ).populate( 'hospital', 'nombre img' );
        
        res.json({
            ok: true,
            medico
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error al consultar al médico'
        });
    }
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

    const  medicoID = req.params.id;
    const uid = req.uid;

    try {
        
        const medicoDB = await Medico.findById( medicoID );

        if ( !medicoDB ){
            return res.status(404).json({
                ok:false,
                msg: 'Medico no encontrado'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario:uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate( medicoID, cambiosMedico, { new:true } );
        
        res.json({
            ok:true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar al médico.'
        });
    }

}

const borrarMedico = async( req, res = response ) => {
    const  medicoID = req.params.id;

    try {
        
        const medicoDB = await Medico.findById( medicoID );

        if ( !medicoDB ){
            return res.status(404).json({
                ok:false,
                msg: 'Médico no encontrado'
            });
        }

        await Medico.findByIdAndDelete( medicoID );
        
        res.json({
            ok:true,
            msg: 'Médico Eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el médico'
        });
        
    }
}

module.exports = {
    getMedicos,
    getMedico,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
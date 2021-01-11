const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = ( req, res = response ) =>{

    const tipo = req.params.tipo
    const id = req.params.id

    const tiposValidos = ['medicos', 'usuarios', 'hospitales'];

    if( !tiposValidos.includes(tipo) ){

        res.status(400).json({
            ok:false,
            msg:'Error en el tipo. medicos/usuarios/hospitales'
        });

    }

    // Validar que exista un archivo
    if( !req.files || Object.keys(req.files).length === 0 ){
        res.status(400).json({
            ok:false,
            msg:'No hay archivo para subir'
        });
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length-1 ];

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if ( !extensionesValidas.includes(extensionArchivo) ){
        res.status(400).json({
            ok:false,
            msg:'Extensión de archivo no permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Crear path para crear la imagen
    const path = `./uploads/${ tipo }/${nombreArchivo}`;

    // Mover la imagen al path
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg: 'Error al subir archivo, validar la consola.'
            });
        }

        // Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );

        res.status(200).json({
            ok:true,
            msg:'Archivo subido al servidor',
            nombreArchivo
        });
      });

}

const retornaImagen = ( req, res = response ) => {
    const tipo = req.params.tipo
    const imagen = req.params.imagen
    const pathImg = path.join( __dirname, `../uploads/${tipo}/${imagen}` );

    // Imagen por defecto
    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else {
        const pathImgDef = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImgDef );
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}
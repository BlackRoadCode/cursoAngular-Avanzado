
const express = require('express');

// Crear servidor express
const app = express();

// Rutas
app.get( '/', ( req, res ) => {
    res.json({
        ok:true,
        msg:'Hola Mundo'
    });
});


app.listen(3000, () =>{
    console.log( 'Servidor corriendo en puerto: ' + 3000 );
});
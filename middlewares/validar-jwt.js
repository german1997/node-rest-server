const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        const usuario = await User.findById( uid );

        if ( !usuario ){
            return res.status(401).json({
                msg: 'token no valido - usuario no existe en bd'
            });
        }

        if ( !usuario.status ){
            return res.status(401).json({
                msg: 'token no valido - usuario con estado- false:'
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    } 
}


module.exports = {
    validarJWT
}
const { response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si correo existe
        const usuario = await User.findOne({ correo });

        if ( !usuario ){
            return res.status(400).json({
                msg : 'usuario / password no son correctos - correo'
             })
        }

        // Verificar si usuario esta activo

        if ( !usuario.status ){
            return res.status(400).json({
                msg : 'usuario / password no son correctos - estado false'
             })
        }
        // Verifica contraseña

        const validarcontraseña = bcryptjs.compareSync( password , usuario.password );

        if ( !validarcontraseña ){
            return res.status(400).json({
                msg : 'usuario / password no son correctos - password'
             })
        }

        //Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
         });
         
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : 'Hable con el adm'
         })
    }
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await User.findOne({ correo });

        if ( !usuario ) {
            // Crear usuario
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            };

            usuario = new User( data );
            await usuario.save();
        }

        // Si el usuario en BD

        if ( !usuario.status ){
            return res.status(401).json({
                msg: 'Hable con el adm, usuario bloqueado'
            });
        }

        // Generar el jwt

        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}
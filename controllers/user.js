const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const usuariosGet = async (req, res = response) => {

    const query = { status: true};

    const { limit = 5, desde = 0 } = req.query;
    // const usuarios = await User.find(query)
    //                 .skip( Number(desde) )
    //                 .limit( Number(limit) );

    // const total = await User.countDocuments(query);

    const [ total, usuarios ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number(desde) )
            .limit( Number(limit) )
    ])
        
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, role} = req.body;
    const usuario = new User( { nombre, correo, password, role } );

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async (req, res = response) => {

    const id = req.params.id
    const { password, google, correo, ...resto } = req.body;

    //TODO: Validar contra BD
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await User.findByIdAndUpdate( id, resto );

    res.json({
      usuario
    });
  }

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const usuario = await User.findByIdAndUpdate(id, {status: false})
    const usuarioAutenticado = req.usuario;
    
    res.json({
        usuario,
        usuarioAutenticado
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}
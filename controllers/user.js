const { response } = require('express');

const usuariosGet = (req, res = response) => {
    const query = req.query;
    res.json(query);
}

const usuariosPost = (req, res = response) => {
    const body = req.body;
    res.json(body);
}

const usuariosPut = (req, res = response) => {

    const id = req.params.id

    res.json({
      msg: id
    });
  }

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete'
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
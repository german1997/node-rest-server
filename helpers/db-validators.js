const Role = require('../models/role');
const User = require('../models/user');

const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${role} no esta registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${correo} ya esta registrado en la BD`);
    }
}

const existeUsuarioPorId = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await User.findById( id ).exec();
        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}
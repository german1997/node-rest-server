const { Schema, model } = require('mongoose');

const userSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true,'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'La password es obligatorio'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: [true,'El rol es obligatorio'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    },
});

userSchema.methods.toJSON = function(){
    const { __v, password, ...user} = this.toObject();
    return user;
}

module.exports = model('User', userSchema );
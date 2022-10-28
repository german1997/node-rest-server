const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require('../controllers/user');

const { esRoleValido,
        emailExiste,
        existeUsuarioPorId } = require('../helpers/db-validators');

const { 
        validarCampos,
        validarJWT,
        tieneRol
 } = require('../middlewares')

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('role').custom(esRoleValido),
        validarCampos
], usuariosPut);

router.post('/', [
        check('correo').isEmail(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio y mas de 6 caracteres').isLength({ min: 6 }),
        //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom(esRoleValido),
        check('correo').custom(emailExiste),
        validarCampos
], usuariosPost);

router.delete('/:id', [
        validarJWT,
        // esAdminRole,
        tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('role').custom(esRoleValido),
],
usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
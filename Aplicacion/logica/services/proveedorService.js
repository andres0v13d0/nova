const fetch = require('node-fetch');
const db = require('../../accesodatos');
const bcrypt = require('bcrypt');
const enviarCorreo = require('./emailService');
const generarCodigo = require('./codigoService');
const authService = require('./authService');
const { token } = require('./tokenRuc');


const registrarUsuarioYEmpresa = async (usuarioData, empresaData) => {
    try {
        const usuarioExistente = await db.usuario.findOne({ where: { correoelectronico: usuarioData.correoelectronico } });
        if (usuarioExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuarioData.contrasena, saltRounds);
        usuarioData.contrasena = hashedPassword;

        const codigoConfirmacion = generarCodigo();
        usuarioData.codigoconfirmacion = codigoConfirmacion;

        await db.tbltuser.create(usuarioData);
        empresaData.correoelectronico = usuarioData.correoelectronico;
        await db.tablatememp.create(empresaData);

        await enviarCorreo(usuarioData.correoelectronico, 'Confirmación de cuenta', `Tu código de confirmación es: ${codigoConfirmacion}`);

        return { message: 'Registro exitoso. Revisa tu correo para el código de confirmación.' };
    } catch (error) {
        throw new Error(`Error registrando el usuario: ${error.message}`);
    }
};

const confirmarRegistro = async (correo, codigo) => {
    const transaction = await db.sequelize.transaction();
    try {
        const usuarioTemp = await db.tbltuser.findOne({ where: { correoelectronico: correo, codigoconfirmacion: codigo } });
        if (!usuarioTemp) {
            throw new Error('Código de confirmación incorrecto');
        }

        const usuarioData = usuarioTemp.get({ plain: true });
        delete usuarioData.codigoconfirmacion;

        const usuario = await db.usuario.create(usuarioData, { transaction });

        const empresaTemp = await db.tablatememp.findOne({ where: { correoelectronico: usuario.correoelectronico } });
        let empresaData = empresaTemp.get({ plain: true });
        empresaData.usuarioid = usuario.usuarioid;
        await db.empresa.create(empresaData, { transaction });

        await usuarioTemp.destroy({ transaction });
        await empresaTemp.destroy({ transaction });

        await transaction.commit();

        return usuario;
    } catch (error) {
        await transaction.rollback();
        console.error('Error Sucedido: ', error);
        throw new Error(`Error confirmando el registro: ${error.message}`);
    }
};

const buscarRuc = async (ruc) => {
    try {
        const response = await fetch(`https://webservices.ec/api/ruc/${ruc}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.data || !data.data.main || !data.data.addit) {
            console.error('Respuesta de API inesperada:', data);
            throw new Error('La estructura de la respuesta de la API no es la esperada');
        }

        
        return {
            nombre: data.data.main[0].razonSocial.split(' ')[1],
            apellido: data.data.main[0].razonSocial.split(' ')[2],
            estadoRuc: data.data.main[0].estadoContribuyenteRuc,
            nombreEmpresa: data.data.addit[0].nombreFantasiaComercial,
            direccionEmpresa: data.data.addit[0].direccionCompleta,
            estadoEmpresa: data.data.addit[0].estado
        };
    } catch (error) {
        console.error('Error fetching RUC info:', error);
        throw new Error(`Error fetching RUC info: ${error.message}`);
    }
};

const actualizarEmpresa = async (ruc, empresaData) => {
    try {
        const empresa = await db.empresa.findOne({ where: { ruc } });
        if (!empresa) {
            throw new Error('Empresa no encontrada');
        }

        await empresa.update(empresaData);
        return { message: 'Datos de la empresa actualizados correctamente' };
    } catch (error) {
        throw new Error(`Error actualizando la empresa: ${error.message}`);
    }
};

const listarProveedores = async () => {
    try {
        const proveedores = await db.empresa.findAll({
            include: [{
                model: db.usuario,
                as: 'usuario',  // Especifica el alias aquí
                where: { rol: 'proveedor' },
                attributes: ['nombre', 'apellido']
            }]
        });

        return proveedores.map(proveedor => ({
            ruc: proveedor.ruc,
            nombreempresa: proveedor.nombreempresa,
            direccion: proveedor.direccionempresa,
            estadoruc: proveedor.estadoruc,
            estadoempresa: proveedor.estadoempresa,
            nombre: proveedor.usuario.nombre + ' ' + proveedor.usuario.apellido
        }));
    } catch (error) {
        console.error('Error fetching proveedores:', error);
        throw new Error(`Error fetching proveedores: ${error.message}`);
    }
};

module.exports = {
    registrarUsuarioYEmpresa,
    confirmarRegistro,
    buscarRuc,
    actualizarEmpresa,
    listarProveedores
};

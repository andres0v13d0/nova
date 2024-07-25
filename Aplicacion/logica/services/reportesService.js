const db = require('../../accesodatos');

const obtenerReporteProductos = async () => {
    try {
        const productos = await db.producto.findAll({
            include: {
                model: db.categoria,
                as: 'categoria',
                attributes: ['nombre']
            }
        });
        return productos.map(producto => ({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidadStock: producto.cantidadstock,
            categoria: producto.categoria.nombre
        }));
    } catch (error) {
        throw new Error(`Error obteniendo reporte de productos: ${error.message}`);
    }
};

const obtenerReporteClientes = async () => {
    try {
        const clientes = await db.usuario.findAll({
            where: { rol: 'cliente' },
            attributes: ['nombre', 'apellido', 'correoelectronico', 'direccion', 'telefono']
        });
        return clientes;
    } catch (error) {
        throw new Error(`Error obteniendo reporte de clientes: ${error.message}`);
    }
};

const obtenerReporteProveedores = async () => {
    try {
        const proveedores = await db.empresa.findAll({
            include: {
                model: db.usuario,
                as: 'usuario',
                where: { rol: 'proveedor' },
                attributes: ['nombre', 'apellido']
            }
        });
        return proveedores.map(proveedor => ({
            ruc: proveedor.ruc,
            nombreEmpresa: proveedor.nombreempresa,
            direccion: proveedor.direccionempresa,
            estadoEmpresa: proveedor.estadoempresa,
            dueno: `${proveedor.usuario.nombre} ${proveedor.usuario.apellido}`
        }));
    } catch (error) {
        throw new Error(`Error obteniendo reporte de proveedores: ${error.message}`);
    }
};

const obtenerReporteVentas = async () => {
    try {
        const ventas = await db.pedido.findAll({
            where: { estado: 'completado' },
            include: {
                model: db.usuario,
                as: 'usuario',
                attributes: ['nombre', 'apellido']
            }
        });
        return ventas.map(venta => ({
            nombre: `${venta.usuario.nombre} ${venta.usuario.apellido}`,
            fechaPedido: venta.fechapedido,
            total: venta.total
        }));
    } catch (error) {
        throw new Error(`Error obteniendo reporte de ventas: ${error.message}`);
    }
};

const obtenerReporteFeedback = async () => {
    try {
        const feedbacks = await db.feedback.findAll({
            include: [{
                model: db.pedido,
                as: 'pedido',
                include: {
                    model: db.usuario,
                    as: 'usuario',
                    attributes: ['nombre', 'apellido']
                }
            }]
        });
        return feedbacks.map(feedback => ({
            nombre: `${feedback.pedido.usuario.nombre} ${feedback.pedido.usuario.apellido}`,
            calificacion: feedback.calificacion,
            comentario: feedback.comentario
        }));
    } catch (error) {
        throw new Error(`Error obteniendo reporte de feedback: ${error.message}`);
    }
};

module.exports = {
    obtenerReporteProductos,
    obtenerReporteClientes,
    obtenerReporteProveedores,
    obtenerReporteVentas,
    obtenerReporteFeedback
};

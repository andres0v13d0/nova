const db = require('../../accesodatos');
const enviarCorreo = require('./emailService');
const QRCode = require('qrcode');

const obtenerProductos = async () => {
    try {
        return await db.productoproveedor.findAll({
            include: [
                { model: db.categoria, as: 'categoria' },
                { 
                    model: db.usuario, 
                    as: 'proveedor',
                    include: [{ model: db.empresa, as: 'empresa' }]
                }
            ],
            order: [['precioproducto', 'ASC']]
        });
    } catch (error) {
        throw new Error(`Error obteniendo productos: ${error.message}`);
    }
};

const obtenerCategorias = async () => {
    try {
        return await db.categoria.findAll();
    } catch (error) {
        throw new Error(`Error obteniendo categorías: ${error.message}`);
    }
};

const obtenerEmpresas = async () => {
    try {
        return await db.empresa.findAll({
            attributes: ['usuarioid', 'nombreempresa']
        });
    } catch (error) {
        throw new Error(`Error obteniendo empresas: ${error.message}`);
    }
};

const finalizarCompra = async (carrito, adminId) => {
    try {
        if (!Array.isArray(carrito) || carrito.length === 0) {
            throw new Error('El carrito está vacío');
        }

        let proveedores = {};

        for (const item of carrito) {
            await db.productos_temporales.create({
                nombreproducto: item.nombreproducto,
                descripcionproducto: item.descripcionproducto,
                precioproducto: item.precioproducto,
                cantidad: item.cantidad,
                categoriaid: item.categoriaid,
                imagen: item.imagenproducto,
                usuarioid: adminId,
                nombreempresa: item.proveedor.empresa.nombreempresa
            });

            if (!proveedores[item.proveedor.empresa.nombreempresa]) {
                proveedores[item.proveedor.empresa.nombreempresa] = {
                    productos: [],
                    correoProveedor: item.proveedor.correoelectronico
                };
            }

            proveedores[item.proveedor.empresa.nombreempresa].productos.push(item.nombreproducto);
        }

        for (const [nombreEmpresa, { productos, correoProveedor }] of Object.entries(proveedores)) {
            const qrData = `Empresa: ${nombreEmpresa}`;
            const qrCode = await QRCode.toDataURL(qrData);
            const adjunto = {
                filename: 'qr.png',
                content: qrCode.split(',')[1]
            };

            await enviarCorreo(correoProveedor, 'Nuevo Pedido', `El administrador ha realizado un pedido a su empresa.`, adjunto);
        }

        return { message: 'Compra finalizada y correos enviados' };
    } catch (error) {
        throw new Error(`Error finalizando compra: ${error.message}`);
    }
};

const limpiarPrecio = (precio) => {
    let precioLimpio = precio.replace(/[^0-9.-]+/g, "");
    let precioNumerico = parseFloat(precioLimpio);
    return isNaN(precioNumerico) ? 0 : precioNumerico;
};

const marcarPedidoRecibido = async (adminId, nombreEmpresa) => {
    try {
        const productosTemporales = await db.productos_temporales.findAll({ where: { usuarioid: adminId, nombreempresa: nombreEmpresa } });

        for (const item of productosTemporales) {
            const precioLimpio = limpiarPrecio(item.precioproducto);

            const productoExistente = await db.producto.findOne({
                where: {
                    nombre: item.nombreproducto,
                    descripcion: item.descripcionproducto,
                    precio: precioLimpio,
                    categoriaid: item.categoriaid
                }
            });

            if (productoExistente) {
                productoExistente.cantidadstock += item.cantidad;
                await productoExistente.save();
            } else {
                await db.producto.create({
                    nombre: item.nombreproducto,
                    descripcion: item.descripcionproducto,
                    precio: precioLimpio,
                    cantidadstock: item.cantidad,
                    categoriaid: item.categoriaid,
                    imagen: item.imagen
                });
            }

            await item.destroy();
        }
        
        return { message: 'Productos agregados al inventario' };
    } catch (error) {
        throw new Error(`Error marcando pedido como recibido: ${error.message}`);
    }
};

const obtenerPedidos = async (adminId) => {
    try {
        return await db.productos_temporales.findAll({ where: { usuarioid: adminId } });
    } catch (error) {
        throw new Error(`Error obteniendo pedidos: ${error.message}`);
    }
};

module.exports = {
    obtenerProductos,
    obtenerCategorias,
    obtenerEmpresas,
    finalizarCompra,
    marcarPedidoRecibido,
    obtenerPedidos
};

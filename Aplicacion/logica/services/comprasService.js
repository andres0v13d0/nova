const db = require('../../accesodatos');
const enviarCorreo = require('./emailService');

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

        for (const item of carrito) {
            await db.productos_temporales.create({
                nombreproducto: item.nombreproducto,
                descripcionproducto: item.descripcionproducto,
                precioproducto: item.precioproducto,
                cantidad: item.cantidad,
                categoriaid: item.categoriaid,
                imagen: item.imagenproducto,
                usuarioid: adminId
            });
        }

        const pedidos = carrito.map(item => ({
            producto: item.nombreproducto,
            cantidad: item.cantidad,
            precio: item.precioproducto,
            proveedor: item.proveedor.nombre,
            correoProveedor: item.proveedor.correoelectronico
        }));

        for (const pedido of pedidos) {
            await enviarCorreo(pedido.correoProveedor, 'Nuevo Pedido', `El administrador ha realizado un pedido de ${pedido.cantidad} unidades del producto ${pedido.producto}.`);
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

const marcarPedidoRecibido = async (adminId) => {
    try {
        const productosTemporales = await db.productos_temporales.findAll({ where: { usuarioid: adminId } });

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


module.exports = {
    obtenerProductos,
    obtenerCategorias,
    obtenerEmpresas,
    finalizarCompra,
    marcarPedidoRecibido
};

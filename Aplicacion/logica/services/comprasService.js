const db = require('../../accesodatos');
const enviarCorreo = require('./emailService');
const QRCode = require('qrcode');
const PdfkitConstruct = require('pdfkit-construct');

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
            console.log(`Generando QR para la empresa: ${nombreEmpresa}`);
            const qrData = `Empresa: ${nombreEmpresa}`;
            const qrCode = await QRCode.toDataURL(qrData);
            console.log('QR Code generado:', qrCode);

            const pdfBuffer = await crearPdfConQr(qrCode);
            console.log('PDF generado:', pdfBuffer);

            const adjunto = {
                filename: 'qr.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            };

            await enviarCorreo(correoProveedor, 'Nuevo Pedido', `El administrador ha realizado un pedido a su empresa.`, adjunto);
            console.log(`Correo enviado a: ${correoProveedor}`);
        }

        return { message: 'Compra finalizada y correos enviados' };
    } catch (error) {
        throw new Error(`Error finalizando compra: ${error.message}`);
    }
};

const crearPdfConQr = async (qrCode) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Iniciando la creación del PDF');
            const doc = new PdfkitConstruct({
                size: 'A4',
                margins: { top: 0, left: 20, right: 20, bottom: 0 },
                bufferPages: true,
            });

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                console.log('PDF creado exitosamente');
                resolve(pdfData);
            });

            doc.setDocumentHeader({
                height: "20"
            }, () => {
                doc.lineJoin('miter')
                    .rect(0, 0, doc.page.width, 30)
                    .fill("#00B0F0");
                doc.image('logo1.png', 240, 40, { width: 120 });
            });

            doc.setDocumentFooter({}, () => {
                doc.lineJoin('miter')
                    .rect(0, doc.footer.y + 11, doc.page.width, 30)
                    .fill("#00B0F0");
                doc.font('bold.ttf')
                    .fill('white')
                    .lineWidth(10)
                    .fontSize(12)
                    .text('Riobamba - 2024', 0, doc.footer.y + 17,{
                    width: doc.page.width,
                    align: 'center',
                });
            });

            doc.image(qrCode, 50, 100, { width: 500 });
            doc.font('bold.ttf')
                    .fill('black')
                    .lineWidth(10)
                    .fontSize(15)
                    .text('Por favor, coloque este código QR en un lugar visible del paquete para facilitar la recepción y verificación de su pedido.', 50, 600,{
                    width: doc.page.width - 100,
                    align: 'center',
            });

            doc.render();
            doc.end();
        } catch (error) {
            console.error('Error creando el PDF:', error);
            reject(error);
        }
    });
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

const db = require('../../accesodatos');
const PdfkitConstruct = require('pdfkit-construct');
const fs = require('fs');
const enviarCorreo = require('./emailService');

const crearPedido = async (usuarioid, carrito) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.pedido.create({
            usuarioid: usuarioid,
            fechapedido: new Date(),
            estado: 'pendiente',
            total: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
        }, { transaction });

        for (const item of carrito) {
            await db.pedidoproducto.create({
                pedidoid: pedido.pedidoid,
                productoid: item.productoid,
                cantidad: item.cantidad,
                precio: item.precio
            }, { transaction });
        }

        await transaction.commit();
        return pedido;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error creando el pedido: ${error.message}`);
    }
};

const registrarVenta = async (pedidoId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.pedido.findByPk(pedidoId, { transaction });
        
        if (!pedido) throw new Error('Pedido no encontrado');

        pedido.estado = 'completado';
        await pedido.save({ transaction });

        const pedidoProductos = await db.pedidoproducto.findAll({ where: { pedidoid: pedidoId }, transaction });
        for (const pedidoProducto of pedidoProductos) {
            const producto = await db.producto.findByPk(pedidoProducto.productoid, { transaction });
            if (producto) {
                producto.cantidadstock -= pedidoProducto.cantidad;
                await producto.save({ transaction });
            }
        }

        await db.pago.create({
            pedidoid: pedidoId,
            precio: pedido.total,
            fechapago: new Date()
        }, { transaction });

        await generarYEnviarFactura(pedidoId);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error registrando la venta: ${error.message}`);
    }
};

const generarYEnviarFactura = async (pedidoId) => {
    try {
        const pdfBuffer = await crearFacturaPdf(pedidoId);
        const pedido = await db.pedido.findByPk(pedidoId);
        const usuario = await db.usuario.findByPk(pedido.usuarioid);

        if (!usuario || !usuario.correoelectronico) throw new Error('Usuario o correo no encontrado');

        const adjunto = {
            filename: 'factura.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf'
        };

        await enviarCorreo(usuario.correoelectronico, 'Factura de su pedido', 'Adjunto encontrará la factura de su pedido.', adjunto);
        console.log(`Correo enviado a: ${usuario.correo}`);

        return { message: 'Factura generada y correo enviado' };
    } catch (error) {
        throw new Error(`Error generando y enviando la factura: ${error.message}`);
    }
};

const crearFacturaPdf = async (pedidoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pedido = await db.pedido.findByPk(pedidoId);
            const pedidoProductos = await db.pedidoproducto.findAll({ where: { pedidoid: pedidoId } });
            const usuario = await db.usuario.findByPk(pedido.usuarioid);

            if (!pedido || !usuario) throw new Error('Pedido o usuario no encontrado');

            const productos = pedidoProductos.map(pp => ({
                productoid: pp.productoid,
                cantidad: pp.cantidad || 0,
                nombre: pp.nombre || 'Producto sin nombre',
                precio: pp.precio || 0,
                descuento: pp.descuento || 0,
                preciototal: (pp.precio || 0) * (pp.cantidad || 0) - (pp.descuento || 0)
            }));

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
                height: 369,
            }, () => { });

            doc.image('factura.jpg', 0, 0, { width: doc.page.width });
            doc.image('logo1.png', 60, 35, { width: 200 });
            doc.font('bold.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(11)
                .text('1804822011001', 360, 8.5);
            doc.font('bold.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('001-003-020432224', 360, 70);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('0607202401179251243300120010030204322240000000013', 336, 100);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('2024-07-06T14:12:50-05:00', 405, 120);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('0607202401179251243300120010030204322240000000013', 340, 230);
            doc.font('bold.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(11)
                .text('NOVATECH', 150, 122);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('Av. Daniel León Borja 456, Edificio Plaza Central, Local 12', 90, 140);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('Av. Daniel León Borja 456, Edificio Plaza Central, Local 12', 90, 180);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('NO', 125, 216);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('NO', 160, 232);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(usuario.nombre || 'Cliente', 150, 252);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text('25/07/2024', 95, 278);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(usuario.direccion || 'Dirección no proporcionada', 63, 295);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(usuario.telefono || '0000000000', 425, 252);
            doc.addTable(
                [
                    { key: 'productoid', label: '', align: 'left' },
                    { key: 'cantidad', label: '', align: 'center' },
                    { key: 'nombre', label: '', align: 'center' },
                    { key: 'precio', label: '', align: 'center' },
                    { key: 'descuento', label: '', align: 'center' },
                    { key: 'preciototal', label: '', align: 'center' }
                ],
                productos, {
                headBackground: 'white',
                headHeight: -20,
                headFontSize: 0,
                cellsFontSize: 7,
                width: "fill_body",
                striped: true,
                stripedColors: ["white"],
                cellsPadding: 3,
                marginLeft: 5.5,
                border: { size: 1, color: 'black' },
                marginRight: 2,
                cellsFont: 'normal.ttf'
            });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text(usuario.correo, 100, 523);
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text(`$ ${pedido.total.toFixed(2)}`, 0, 492, {
                    width: 570,
                    align: "right"
                }); //PrecioTotal
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 507, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 521, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text(`$ ${pedido.total.toFixed(2)}`, 0, 536, {
                    width: 570,
                    align: "right"
                }); //PrecioTotal
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 550, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 566, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 579, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text(`$ ${(pedido.total * 0.15).toFixed(2)}`, 0, 595, {
                    width: 570,
                    align: "right"
                }); // 15% de PrecioTotal
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 610, {
                    width: 570,
                    align: "right"
                });
            doc.font('normal.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text('$ 0.00', 0, 624, {
                    width: 570,
                    align: "right"
                });
            doc.font('bold.ttf')
                .fill('black')
                .lineWidth(10)
                .fontSize(7)
                .text(`$ ${pedido.total.toFixed(2)}`, 0, 638, {
                    width: 570,
                    align: "right"
                });

            doc.render();
            doc.end();
        } catch (error) {
            console.error('Error creando el PDF:', error);
            reject(error);
        }
    });
};

module.exports = {
    crearPedido,
    registrarVenta,
};

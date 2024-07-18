const db = require('../../accesodatos');
const axios = require('axios');
const { SignedXml } = require('xml-crypto');
const fs = require('fs');
const enviarCorreo = require('../../logica/services/emailService');
const { p12FilePath, p12Password } = require('../../tokenFacturacion');

function generarClaveAcceso(fecha, tipoComprobante, ruc, ambiente, serie, numeroComprobante, codigoNumerico, tipoEmision) {
    const clave = fecha + tipoComprobante + ruc + ambiente + serie + numeroComprobante + codigoNumerico + tipoEmision;
    const digitoVerificador = calcularDigitoVerificador(clave);
    return clave + digitoVerificador;
}

function calcularDigitoVerificador(clave) {
    const pesos = [2, 3, 4, 5, 6, 7];
    let suma = 0;
    let pesoIndex = 0;

    for (let i = clave.length - 1; i >= 0; i--) {
        suma += parseInt(clave[i]) * pesos[pesoIndex];
        pesoIndex = (pesoIndex + 1) % pesos.length;
    }

    const modulo = suma % 11;
    const digitoVerificador = modulo === 0 ? 0 : 11 - modulo;

    return digitoVerificador === 10 ? 1 : digitoVerificador;
}

function generarXML(datosFactura) {
    const { create } = require('xmlbuilder2');
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('factura', { id: 'comprobante', version: '1.0.0' })
        .ele('infoTributaria')
        .ele('ambiente').txt('1').up()
        .ele('tipoEmision').txt('1').up()
        .ele('razonSocial').txt(datosFactura.razonSocial).up()
        .ele('ruc').txt(datosFactura.ruc).up()
        .ele('claveAcceso').txt(datosFactura.claveAcceso).up()
        .ele('codDoc').txt('01').up()
        .ele('estab').txt(datosFactura.estab).up()
        .ele('ptoEmi').txt(datosFactura.ptoEmi).up()
        .ele('secuencial').txt(datosFactura.secuencial).up()
        .ele('dirMatriz').txt(datosFactura.dirMatriz).up()
        .up()
        .ele('infoFactura')
        .ele('fechaEmision').txt(datosFactura.fechaEmision).up()
        .ele('dirEstablecimiento').txt(datosFactura.dirEstablecimiento).up()
        .ele('obligadoContabilidad').txt('NO').up()
        .ele('tipoIdentificacionComprador').txt('05').up()
        .ele('razonSocialComprador').txt(datosFactura.razonSocialComprador).up()
        .ele('identificacionComprador').txt(datosFactura.identificacionComprador).up()
        .ele('totalSinImpuestos').txt(datosFactura.totalSinImpuestos).up()
        .ele('totalDescuento').txt('0.00').up()
        .up()
        .ele('detalles')
        .ele('detalle')
        .ele('codigoPrincipal').txt(datosFactura.codigoPrincipal).up()
        .ele('descripcion').txt(datosFactura.descripcion).up()
        .ele('cantidad').txt(datosFactura.cantidad).up()
        .ele('precioUnitario').txt(datosFactura.precioUnitario).up()
        .ele('descuento').txt('0.00').up()
        .ele('precioTotalSinImpuesto').txt(datosFactura.precioTotalSinImpuesto).up()
        .end({ prettyPrint: true });

    return doc.toString();
}

function signXML(xml) {
    const sig = new SignedXml();
    const p12Content = fs.readFileSync(p12FilePath);
    sig.signingKey = {
        key: p12Content,
        passphrase: p12Password,
    };
    sig.addReference("//*[local-name(.)='factura']");
    sig.computeSignature(xml);
    return sig.getSignedXml();
}

async function enviarXML(xmlFirmado) {
    try {
        const response = await axios.post('https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantes', xmlFirmado, {
            headers: { 'Content-Type': 'application/xml' }
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar XML al SRI:', error);
    }
}

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
        pedido.estado = 'completado';
        await pedido.save({ transaction });

        const pedidoProductos = await db.pedidoproducto.findAll({ where: { pedidoid: pedidoId }, transaction });
        for (const pedidoProducto of pedidoProductos) {
            const producto = await db.producto.findByPk(pedidoProducto.productoid, { transaction });
            producto.cantidadstock -= pedidoProducto.cantidad;
            await producto.save({ transaction });
        }

        await db.pago.create({
            pedidoid: pedidoId,
            precio: pedido.total,
            fechapago: new Date()
        }, { transaction });

        // Generar y firmar el XML de la factura
        const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const claveAcceso = generarClaveAcceso(fecha, '01', '1804822011001', '1', '001001', String(pedidoId).padStart(9, '0'), '12345678', '1');

        const datosFactura = {
            razonSocial: 'YANZAPANTA ESPIN JONATHAN ISRAEL',
            ruc: '1804822011001',
            claveAcceso,
            estab: '001',
            ptoEmi: '001',
            secuencial: String(pedidoId).padStart(9, '0'),
            dirMatriz: 'VIA A SAN PABLO S/N, A UNA CUADRA DEL CANCHA MULTIPLE, CASA DE UN PISO, COLOR BLANCO',
            fechaEmision: new Date().toISOString().split('T')[0],
            dirEstablecimiento: 'VIA A SAN PABLO S/N, A UNA CUADRA DEL CANCHA MULTIPLE, CASA DE UN PISO, COLOR BLANCO',
            razonSocialComprador: 'Nombre del Comprador',
            identificacionComprador: '1234567890',
            totalSinImpuestos: pedido.total,
            codigoPrincipal: '001',
            descripcion: 'Descripción del Producto',
            cantidad: 1,
            precioUnitario: pedido.total,
            precioTotalSinImpuesto: pedido.total
        };

        const xml = generarXML(datosFactura);
        const xmlFirmado = signXML(xml);

        // Enviar el XML al SRI
        const xmlAutorizado = await enviarXML(xmlFirmado);

        // Enviar la factura por correo
        const usuario = await db.usuario.findByPk(pedido.usuarioid);
        await enviar
        await enviarCorreo(usuario.email, 'Factura Electrónica', 'Adjunto encontrará su factura electrónica.', xmlAutorizado);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error registrando la venta: ${error.message}`);
    }
};

module.exports = {
    crearPedido,
    registrarVenta,
};

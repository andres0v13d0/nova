const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');
const { SignedXml } = require('xml-crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const PdfkitConstruct = require('pdfkit-construct');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, p12FilePath,  p12Password} = require('./tokenFacturacion');

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const generarXMLFactura = (datosFactura, productos) => {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('factura', { id: 'comprobante', version: '2.1.0' })
        .ele('infoTributaria')
        .ele('ambiente').txt(datosFactura.ambiente).up()
        .ele('tipoEmision').txt(datosFactura.tipoEmision).up()
        .ele('razonSocial').txt(datosFactura.razonSocial).up()
        .ele('nombreComercial').txt(datosFactura.nombreComercial).up()
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
        .ele('contribuyenteEspecial').txt(datosFactura.contribuyenteEspecial).up()
        .ele('obligadoContabilidad').txt(datosFactura.obligadoContabilidad).up()
        .ele('tipoIdentificacionComprador').txt(datosFactura.tipoIdentificacionComprador).up()
        .ele('razonSocialComprador').txt(datosFactura.razonSocialComprador).up()
        .ele('identificacionComprador').txt(datosFactura.identificacionComprador).up()
        .ele('totalSinImpuestos').txt(datosFactura.totalSinImpuestos).up()
        .ele('totalDescuento').txt(datosFactura.totalDescuento).up()
        .ele('totalConImpuestos')
        .ele('totalImpuesto')
        .ele('codigo').txt(datosFactura.totalImpuesto.codigo).up()
        .ele('codigoPorcentaje').txt(datosFactura.totalImpuesto.codigoPorcentaje).up()
        .ele('baseImponible').txt(datosFactura.totalImpuesto.baseImponible).up()
        .ele('tarifa').txt(datosFactura.totalImpuesto.tarifa).up()
        .ele('valor').txt(datosFactura.totalImpuesto.valor).up()
        .up().up()
        .ele('propina').txt(datosFactura.propina).up()
        .ele('importeTotal').txt(datosFactura.importeTotal).up()
        .ele('moneda').txt(datosFactura.moneda).up()
        .ele('pagos')
        .ele('pago')
        .ele('formaPago').txt(datosFactura.pago.formaPago).up()
        .ele('total').txt(datosFactura.pago.total).up()
        .ele('plazo').txt(datosFactura.pago.plazo).up()
        .ele('unidadTiempo').txt(datosFactura.pago.unidadTiempo).up()
        .up().up()
        .ele('valorRetRenta').txt(datosFactura.valorRetRenta).up()
        .up()
        .ele('detalles');

    productos.forEach(producto => {
        doc.ele('detalle')
            .ele('codigoPrincipal').txt(producto.codigoPrincipal).up()
            .ele('descripcion').txt(producto.descripcion).up()
            .ele('unidadMedida').txt(producto.unidadMedida).up()
            .ele('cantidad').txt(producto.cantidad).up()
            .ele('precioUnitario').txt(producto.precioUnitario).up()
            .ele('descuento').txt(producto.descuento).up()
            .ele('precioTotalSinImpuesto').txt(producto.precioTotalSinImpuesto).up()
            .ele('impuestos')
            .ele('impuesto')
            .ele('codigo').txt(producto.impuesto.codigo).up()
            .ele('codigoPorcentaje').txt(producto.impuesto.codigoPorcentaje).up()
            .ele('tarifa').txt(producto.impuesto.tarifa).up()
            .ele('baseImponible').txt(producto.impuesto.baseImponible).up()
            .ele('valor').txt(producto.impuesto.valor).up()
            .up().up().up();
    });

    doc.up()
        .ele('infoAdicional')
        .ele('campoAdicional', { nombre: 'Email' }).txt(datosFactura.email).up()
        .up();

    return doc.end({ prettyPrint: true });
};

const firmarXMLFactura = async (xml) => {
    const sig = new SignedXml();
    const p12Content = fs.readFileSync(p12FilePath);
    sig.signingKey = {
        key: p12Content,
        passphrase: p12Password,
    };
    sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512"; // Algoritmo actualizado

    // Agregar la referencia con el algoritmo de resumen y método de transformación
    sig.addReference(
        "//*[local-name(.)='factura']", // XPath para el elemento que será referenciado
        ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"], // Métodos de transformación
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512" // Algoritmo de resumen
    );

    sig.computeSignature(xml);
    return sig.getSignedXml();
};


const enviarXMLalSRI = async (xmlFirmado) => {
    try {
        const response = await axios.post('https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantes', xmlFirmado, {
            headers: { 'Content-Type': 'application/xml' }
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar XML al SRI:', error);
        throw error;
    }
};

const generarFacturaPDF = (pedido, productos, cliente, datosFactura) => {
    return new Promise((resolve, reject) => {
        const doc = new PdfkitConstruct({
            size: 'A4',
            margins: { top: 0, left: 20, right: 20, bottom: 0 },
            bufferPages: true,
        });

        doc.setDocumentHeader({
            height: 369,
        }, () => {
            doc.image(path.join(__dirname, 'factura.jpg'), 0, 0, { width: doc.page.width });
            doc.image(path.join(__dirname, 'logo1.png'), 60, 35, { width: 200 });
            doc.font(path.join(__dirname, 'bold.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(11)
                .text(datosFactura.ruc, 360, 8.5);
            doc.font(path.join(__dirname, 'bold.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.numeroFactura, 360, 70);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.numeroAutorizacion, 336, 100);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.fechaAutorizacion, 405, 120);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.numeroAutorizacion, 340, 230);
            doc.font(path.join(__dirname, 'bold.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(11)
                .text(datosFactura.razonSocial, 150, 122);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.dirMatriz, 90, 140);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.dirEstablecimiento, 90, 180);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.contribuyenteEspecial, 125, 216);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.obligadoContabilidad, 160, 232);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.razonSocialComprador, 150, 252);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.fechaEmision, 95, 278);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.direccionComprador, 63, 295);
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(8)
                .text(datosFactura.identificacionComprador, 425, 252);
        });

        doc.addTable(
            [
                { key: 'codigoPrincipal', label: 'Código', align: 'left' },
                { key: 'cantidad', label: 'Cantidad', align: 'center' },
                { key: 'descripcion', label: 'Descripción', align: 'center' },
                { key: 'precioUnitario', label: 'Precio Unitario', align: 'center' },
                { key: 'descuento', label: 'Descuento', align: 'center' },
                { key: 'precioTotalSinImpuesto', label: 'Precio Total', align: 'center' }
            ],
            productos.map(producto => ({
                codigoPrincipal: producto.codigoPrincipal,
                cantidad: producto.cantidad,
                descripcion: producto.descripcion,
                precioUnitario: producto.precioUnitario,
                descuento: producto.descuento,
                precioTotalSinImpuesto: producto.precioTotalSinImpuesto,
            })),
            {
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
                cellsFont: path.join(__dirname, 'normal.ttf')
            }
        );

        doc.font(path.join(__dirname, 'normal.ttf'))
            .fill('black')
            .lineWidth(10)
            .fontSize(7)
            .text(datosFactura.email, 100, 523);
        doc.font(path.join(__dirname, 'normal.ttf'))
            .fill('black')
            .lineWidth(10)
            .fontSize(7)
            .text(`$ ${datosFactura.importeTotal}`, 0, 492, {
                width: 570,
                align: "right"
            });
        // Agrega más campos como corresponda

        doc.render();

        const pdfPath = path.join(__dirname, `factura_${datosFactura.secuencial}.pdf`);
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.end();

        doc.on('finish', () => {
            resolve(pdfPath);
        });

        doc.on('error', (error) => {
            reject(error);
        });
    });
};

const enviarFacturaCorreo = async (correoUsuario, pdfPath) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'novaapp12345@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: 'novaapp12345@gmail.com',
            to: correoUsuario,
            subject: 'Factura Electrónica',
            text: 'Adjunto encontrará su factura electrónica.',
            attachments: [
                { filename: 'factura.pdf', path: pdfPath }
            ]
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error enviando el correo:', error);
        throw error;
    }
};

module.exports = {
    generarXMLFactura,
    firmarXMLFactura,
    enviarXMLalSRI,
    generarFacturaPDF,
    enviarFacturaCorreo
};

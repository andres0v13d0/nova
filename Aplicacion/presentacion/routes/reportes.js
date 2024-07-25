const express = require('express');
const router = express.Router();
const reportesService = require('../../logica/services/reportesService');
const PdfkitConstruct = require('pdfkit-construct');
const fs = require('fs');
const path = require('path');

const generarReportePDF = async (titulo, descripcion, columnas, datos, res) => {
    try {
        console.log("Generando PDF...");
        const doc = new PdfkitConstruct({
            size: 'A4',
            margins: { top: 0, left: 10, right: 10, bottom: 0 },
            bufferPages: true,
        });

        doc.setDocumentHeader({
            height: "25"
        }, () => {
            console.log("Configurando encabezado...");
            doc.lineJoin('miter')
                .rect(0, 0, doc.page.width, 30)
                .fill("#00B0F0");
            doc.image(path.join(__dirname, 'logo1.png'), 240, 40, { width: 120 });
            doc.font(path.join(__dirname, 'bold.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(25)
                .text(titulo, 0, 80, {
                    width: doc.page.width,
                    align: 'center',
                });
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(15)
                .text(descripcion, 0, 105, {
                    width: doc.page.width,
                    align: 'center',
                });
            doc.font(path.join(__dirname, 'normal.ttf'))
                .fill('black')
                .lineWidth(10)
                .fontSize(12)
                .text(new Date().toLocaleDateString(), -55, 150, {
                    width: doc.page.width,
                    align: 'right',
                });
        });

        console.log("Agregando tabla...");
        doc.addTable(columnas, datos, {
            headBackground: '#156082',
            headColor: 'white',
            width: "fill_body",
            striped: true,
            stripedColors: ["#C1E4F5", "white"],
            cellsPadding: 10,
            marginLeft: 0,
            marginRight: 0,
            headAlign: 'center',
            headFont: path.join(__dirname, 'bold.ttf'),
            cellsFont: path.join(__dirname, 'normal.ttf')
        });

        doc.setDocumentFooter({}, () => {
            console.log("Configurando pie de página...");
            doc.lineJoin('miter')
                .rect(0, doc.footer.y + 11, doc.page.width, 30)
                .fill("#00B0F0");
            doc.font(path.join(__dirname, 'bold.ttf'))
                .fill('white')
                .lineWidth(10)
                .fontSize(12)
                .text('Riobamba - 2024', 0, doc.footer.y + 17, {
                    width: doc.page.width,
                    align: 'center',
                });
        });

        doc.render();

        const pdfPath = path.join(__dirname, `reporte_${titulo.replace(/\s+/g, '_')}.pdf`);
        console.log(`Generando archivo PDF en: ${pdfPath}`);
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.end();

        doc.on('finish', () => {
            console.log("PDF generado con éxito, iniciando descarga...");
            res.download(pdfPath);
        });
    } catch (error) {
        console.error("Error durante la generación del PDF:", error);
        res.status(500).json({ error: error.message });
    }
};

router.get('/generar/:reporte', async (req, res) => {
    try {
        console.log(`Generando reporte para: ${req.params.reporte}`);
        const reporte = req.params.reporte;
        let datos, columnas, titulo, descripcion;

        switch (reporte) {
            case 'productos':
                datos = await reportesService.obtenerReporteProductos();
                titulo = 'Reporte del Catálogo de Productos';
                descripcion = 'Este reporte contiene información detallada sobre los productos disponibles en el catálogo.';
                columnas = [
                    { key: 'nombre', label: 'Nombre del Producto', align: 'left' },
                    { key: 'descripcion', label: 'Descripción del Producto', align: 'left' },
                    { key: 'precio', label: 'Precio', align: 'right' },
                    { key: 'cantidadStock', label: 'Cantidad en Stock', align: 'right' },
                    { key: 'categoria', label: 'Categoría', align: 'left' },
                ];
                break;
            case 'clientes':
                datos = await reportesService.obtenerReporteClientes();
                titulo = 'Reporte de Clientes Existentes';
                descripcion = 'Este reporte contiene información detallada sobre los clientes registrados en el sistema.';
                columnas = [
                    { key: 'nombre', label: 'Nombre', align: 'left' },
                    { key: 'apellido', label: 'Apellido', align: 'left' },
                    { key: 'correoelectronico', label: 'Correo Electrónico', align: 'left' },
                    { key: 'direccion', label: 'Dirección', align: 'left' },
                    { key: 'telefono', label: 'Teléfono', align: 'left' },
                ];
                break;
            case 'proveedores':
                datos = await reportesService.obtenerReporteProveedores();
                titulo = 'Reporte de Proveedores de la Tienda';
                descripcion = 'Este reporte contiene información detallada sobre los proveedores registrados en el sistema.';
                columnas = [
                    { key: 'ruc', label: 'RUC', align: 'left' },
                    { key: 'nombreEmpresa', label: 'Nombre de la Empresa', align: 'left' },
                    { key: 'direccion', label: 'Dirección', align: 'left' },
                    { key: 'estadoEmpresa', label: 'Estado de la Empresa', align: 'left' },
                    { key: 'dueno', label: 'Dueño', align: 'left' },
                ];
                break;
            case 'ventas':
                datos = await reportesService.obtenerReporteVentas();
                titulo = 'Reporte de Ventas Realizadas';
                descripcion = 'Este reporte contiene información detallada sobre las ventas completadas.';
                columnas = [
                    { key: 'nombre', label: 'Nombre del Cliente', align: 'left' },
                    { key: 'fechaPedido', label: 'Fecha del Pedido', align: 'left' },
                    { key: 'total', label: 'Total de la Venta', align: 'right' },
                ];
                break;
            case 'feedback':
                datos = await reportesService.obtenerReporteFeedback();
                titulo = 'Reporte de Retroalimentaciones';
                descripcion = 'Este reporte contiene información detallada sobre las retroalimentaciones de los clientes.';
                columnas = [
                    { key: 'nombre', label: 'Nombre del Cliente', align: 'left' },
                    { key: 'calificacion', label: 'Calificación', align: 'left' },
                    { key: 'comentario', label: 'Comentario', align: 'left' },
                ];
                break;
            default:
                throw new Error('Tipo de reporte no reconocido.');
        }

        await generarReportePDF(titulo, descripcion, columnas, datos, res);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const PDFDocument = require('pdfkit');
const fs = require('fs');
const { table } = require('pdfkit-table');

const doc = new PDFDocument({ margin: 50 });

// Set the output file
doc.pipe(fs.createWriteStream('output.pdf'));

// Add header with an optional image (uncomment if you have an image)
// doc.image('path/to/image.jpg', 50, 45, { width: 50 });

// Add headers
doc.fontSize(12).text('Riobamba - 2024', {
  align: 'center'
});
doc.moveDown(0.5);
doc.text('Miércoles, 24 de julio de 2024', {
  align: 'center'
});
doc.moveDown(0.5);
doc.fontSize(16).text('Título del Reporte', {
  align: 'center'
});
doc.moveDown(0.5);
doc.fontSize(12).text('Descripción del reporte', {
  align: 'center'
});
doc.moveDown(1);

// Prepare table data
const dataTable = {
  headers: ['Columna 1', 'Columna 2', 'Columna 3', 'Columna 4', 'Columna 5', 'Columna 6'],
  rows: [
    ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4', 'Dato 5', 'Dato 6'],
    ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4', 'Dato 5', 'Dato 6'],
    ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4', 'Dato 5', 'Dato 6'],
    ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4', 'Dato 5', 'Dato 6']
  ]
};

// Draw table
table(doc, {
  headers: dataTable.headers,
  rows: dataTable.rows,
  options: {
    width: doc.page.width - 100
  }
});

// Add footer
doc.fontSize(12).text('Pie de página', 50, doc.page.height - 40, {
  align: 'center',
  width: 500
});

// Finalize the PDF
doc.end();

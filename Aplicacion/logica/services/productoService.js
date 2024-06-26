const db = require('../../accesodatos');
const { authenticate, uploadFile } = require('./googleDriveService');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');

const FILE_NAME = 'productos.csv';
const FILE_PATH = path.join(__dirname, FILE_NAME);
const FILE_ID = '1De9nlotwwAnIrdi62ToJq2AkTpDggXoE';

const actualizarArchivoCSV = async () => {
  try {
    const productos = await db.producto.findAll({ raw: true });
    const csv = parse(productos);

    fs.writeFileSync(FILE_PATH, csv);
    console.log(`Archivo ${FILE_NAME} actualizado localmente`);

    await authenticate();
    await uploadFile(FILE_NAME, FILE_PATH, 'text/csv', FILE_ID);
    console.log('Archivo actualizado en Google Drive');
  } catch (error) {
    console.error('Error al actualizar el archivo CSV:', error);
  }
};

const crearProducto = async (productoData) => {
  const producto = await db.producto.create(productoData);
  await actualizarArchivoCSV();
  return producto;
};

const modificarProducto = async (id, productoData) => {
  const producto = await db.producto.findByPk(id);
  if (producto) {
    await producto.update(productoData);
    await actualizarArchivoCSV();
    return producto;
  } else {
    throw new Error('Producto no encontrado');
  }
};

const eliminarProducto = async (id) => {
  const producto = await db.producto.findByPk(id);
  if (producto) {
    await producto.destroy();
    await actualizarArchivoCSV();
  } else {
    throw new Error('Producto no encontrado');
  }
};

module.exports = {
  crearProducto,
  modificarProducto,
  eliminarProducto,
};

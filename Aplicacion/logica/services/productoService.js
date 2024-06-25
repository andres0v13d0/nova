const db = require('../../accesodatos');
const { authenticate, uploadFile } = require('./googleDriveService');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');

const authenticate = () => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
    });
  };

const FILE_NAME = 'productos.csv';
const FILE_PATH = path.join(__dirname, FILE_NAME);

authenticate();

const actualizarArchivoCSV = async () => {
  const productos = await db.producto.findAll({ raw: true });
  const csv = parse(productos);

  fs.writeFileSync(FILE_PATH, csv);

  
  const fileId = 'YOUR_FILE_ID'; 
  await uploadFile(FILE_NAME, FILE_PATH, 'text/csv', fileId);
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

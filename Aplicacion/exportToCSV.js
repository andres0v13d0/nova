const { Client } = require('pg');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Configuración de la conexión a la base de datos
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'novabd',
  password: 'salchipapa123',
  port: 5432,
});

const FILE_NAME = 'productos.csv';
const FILE_PATH = path.join(__dirname, FILE_NAME);

const exportToCSV = async () => {
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM producto');

    if (res.rows.length === 0) {
      console.log('No hay datos en la tabla producto.');
      return;
    }

    const csv = parse(res.rows);
    fs.writeFileSync(FILE_PATH, csv);

    console.log(`Archivo CSV guardado en ${FILE_PATH}`);
  } catch (err) {
    console.error('Error exportando datos a CSV:', err);
  } finally {
    await client.end();
  }
};

exportToCSV();

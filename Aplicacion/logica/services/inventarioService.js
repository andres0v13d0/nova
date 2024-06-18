// Importa las dependencias
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Configura la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'novabd',
  password: '123456',
  port: 5432,
});

// Manejo de errores de la base de datos
pool.on('error', (err, client) => {
  console.error('Error in PostgreSQL pool', err);
});

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Producto');
    const products = result.rows;
    client.release();
    res.json(products);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
  const { nombre, descripcion, precio, cantidadstock, categoriaid, imagen } = req.body;
  const queryText = 'INSERT INTO Producto (nombre, descripcion, precio, cantidadstock, categoriaid, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [nombre, descripcion, precio, cantidadstock, categoriaid, imagen];

  try {
    const client = await pool.connect();
    const result = await client.query(queryText, values);
    const newProduct = result.rows[0];
    client.release();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// Ruta para actualizar un producto existente
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { nombre, descripcion, precio, cantidadstock, categoriaid, imagen } = req.body;
  const queryText = 'UPDATE Producto SET nombre=$1, descripcion=$2, precio=$3, cantidadstock=$4, categoriaid=$5, imagen=$6 WHERE productoid=$7 RETURNING *';
  const values = [nombre, descripcion, precio, cantidadstock, categoriaid, imagen, productId];

  try {
    const client = await pool.connect();
    const result = await client.query(queryText, values);
    const updatedProduct = result.rows[0];
    client.release();
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// Ruta para eliminar un producto
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const queryText = 'DELETE FROM Producto WHERE productoid=$1';

  try {
    const client = await pool.connect();
    await client.query(queryText, [productId]);
    client.release();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./accesodatos');
const dotenv = require('dotenv').config();
const productoRoutes = require('./presentacion/routes/producto');
const productosProveedorRoutes = require('./presentacion/routes/productosProveedor');
const comprasRoutes = require('./presentacion/routes/compras');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'presentacion/public')));

app.use('/api', require('./presentacion/routes/api'));
app.use('/ventas', require('./presentacion/routes/ventas'));
app.use('/feedback', require('./presentacion/routes/feedback'));
app.use('/usuario', require('./presentacion/routes/usuario'));
app.use('/inventario', require('./presentacion/routes/inventario'));
app.use('/catalogo', require('./presentacion/routes/catalogo'));
app.use('/reportes', require('./presentacion/routes/reportes'));
app.use('/proveedor', require('./presentacion/routes/proveedor'));
app.use('/asistente', require('./presentacion/routes/asistente'));
app.use('/producto', productoRoutes);
app.use('/productosProveedor', productosProveedorRoutes);
app.use('/compras', comprasRoutes);

app.get('/oauth2callback', (req, res) => {
  res.send('OAuth2 callback recibido.');
});

const PORT = process.env.PORT || 3000;
models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});

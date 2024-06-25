const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./accesodatos');
const dotenv = require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'presentacion/public')));

app.use('/api', require('./presentacion/routes/api'));
app.use('/ventas', require('./presentacion/routes/ventas'));
app.use('/feedback', require('./presentacion/routes/feedback'));
app.use('/usuario', require('./presentacion/routes/usuario'));
app.use('/inventario', require('./presentacion/routes/inventario'));
app.use('/catalogo', require('./presentacion/routes/catalogo'));
app.use('/reportes', require('./presentacion/routes/reportes'));
app.use('/proveedores', require('./presentacion/routes/proveedores'));
app.use('/asistente', require('./presentacion/routes/asistente')); 
app.use('/producto', require('./presentacion/routes/producto'));


app.get('/oauth2callback', (req, res) => {
  res.send('OAuth2 callback received.');
});

const PORT = process.env.PORT || 3000;
models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});

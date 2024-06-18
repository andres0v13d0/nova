const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./accesodatos'); 

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'presentacion/public')));

app.use('/api', require('./presentacion/routes/api'));
app.use('/ventas', require('./presentacion/routes/ventas'));
app.use('/feedback', require('./presentacion/routes/feedback'));
//app.use('/inventario', require('./presentacion/routes/inventario'));

const PORT = process.env.PORT || 3000;
models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});

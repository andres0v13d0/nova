const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.js');
const basename = path.basename(__filename);

// Cargar las variables de entorno
require('dotenv').config();

const env = process.env.NODE_ENV || 'production';
const dbConfig = config[env];

// Verificación de la configuración cargada
console.log('DB Config:', dbConfig);

// Mostrar información de la base de datos en la que se está trabajando
console.log(`Conectando a la base de datos '${dbConfig.database}' en el host '${dbConfig.host}' usando '${dbConfig.dialect}'`);

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialect === 'mysql' ? {} : {
    useUTC: false,
    dateStrings: true,
    typeCast: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  },
  logging: false, // Deshabilitar logging si es necesario
});

const db = {};

fs.readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

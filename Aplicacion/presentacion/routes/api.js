const express = require('express');
const router = express.Router();
const ejemploService = require('../../logica/services/ejemploServices');

router.get('/tables', (req, res) => {
  res.json(Object.keys(require('../../accesodatos')).filter(model => model !== 'sequelize' && model !== 'Sequelize'));
});

router.get('/columns/:table', (req, res) => {
  const tableName = req.params.table;
  const model = require('../../accesodatos')[tableName];
  if (model) {
    res.json(Object.keys(model.rawAttributes));
  } else {
    res.status(404).send('Tabla no encontrada');
  }
});

router.get('/records/:table', async (req, res) => {
  const tableName = req.params.table;
  try {
    const records = await ejemploService.findAll(tableName);
    res.json(records);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/records/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  try {
    const record = await ejemploService.findOne(tableName, id);
    res.json(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/records/:table', async (req, res) => {
  const tableName = req.params.table;
  try {
    const record = await ejemploService.create(tableName, req.body);
    res.json(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/records/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  try {
    const updatedRecord = await ejemploService.update(tableName, id, req.body);
    res.send('Registro actualizado');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/records/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  try {
    await ejemploService.remove(tableName, id);
    res.send('Registro eliminado');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

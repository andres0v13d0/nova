const express = require('express');
const multer = require('multer');
const router = express.Router();
const ejemploService = require('../../logica/services/ejemploServices');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/tables', (req, res) => {
  res.json(Object.keys(require('../../accesodatos')).filter(model => model !== 'sequelize' && model !== 'Sequelize'));
});

router.get('/columns/:table', (req, res) => {
  const tableName = req.params.table;
  const model = require('../../accesodatos')[tableName];
  if (model) {
    res.json(Object.keys(model.rawAttributes));
  } else {
    res.status(404).json({ error: 'Tabla no encontrada' });
  }
});

router.get('/records/:table', async (req, res) => {
  const tableName = req.params.table;
  try {
    const records = await ejemploService.findAll(tableName);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/records/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  try {
    const record = await ejemploService.findOne(tableName, id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/records/:table', upload.single('imagen'), async (req, res) => {
  const tableName = req.params.table;
  const data = req.body;
  if (req.file) {
    data.imagen = req.file.buffer.toString('base64');
  }
  try {
    const record = await ejemploService.create(tableName, data);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/records/:table/:id', upload.single('imagen'), async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  const data = req.body;
  if (req.file) {
    data.imagen = req.file.buffer.toString('base64');
  }
  try {
    const updatedRecord = await ejemploService.update(tableName, id, data);
    res.json({ message: 'Registro actualizado', record: updatedRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/records/:table/:id', async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  try {
    await ejemploService.remove(tableName, id);
    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

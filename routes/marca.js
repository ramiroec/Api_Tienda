const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todas las marcas
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM marca').all();
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar una marca por ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM marca WHERE id = ?').get(req.params.id);
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insertar una nueva marca
router.post('/', (req, res) => {
  const { nombre } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO marca (nombre) VALUES (?)');
    const info = stmt.run(nombre);
    res.json({
      message: 'success',
      data: { id: info.lastInsertRowid, nombre },
      id: info.lastInsertRowid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una marca
router.put('/:id', (req, res) => {
  const { nombre } = req.body;
  try {
    const stmt = db.prepare('UPDATE marca SET nombre = ? WHERE id = ?');
    const info = stmt.run(nombre, req.params.id);
    res.json({
      message: 'success',
      data: { id: req.params.id, nombre },
      changes: info.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una marca
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM marca WHERE id = ?');
    const info = stmt.run(req.params.id);
    res.json({
      message: 'deleted',
      changes: info.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

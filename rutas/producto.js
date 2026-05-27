const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los productos
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM producto').all();
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar un producto por ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM producto WHERE id = ?').get(req.params.id);
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insertar un nuevo producto
router.post('/', (req, res) => {
  const { nombre, precio, foto, disponibilidad, id_marca } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO producto (nombre, precio, foto, disponibilidad, id_marca) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(nombre, precio, foto, disponibilidad, id_marca);
    res.json({
      message: 'success',
      data: { id: result.lastInsertRowid, nombre, precio, foto, disponibilidad, id_marca },
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const { nombre, precio, foto, disponibilidad, id_marca } = req.body;
  try {
    const stmt = db.prepare('UPDATE producto SET nombre = ?, precio = ?, foto = ?, disponibilidad = ?, id_marca = ? WHERE id = ?');
    const result = stmt.run(nombre, precio, foto, disponibilidad, id_marca, req.params.id);
    res.json({
      message: 'success',
      data: { id: req.params.id, nombre, precio, foto, disponibilidad, id_marca },
      changes: result.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM producto WHERE id = ?');
    const result = stmt.run(req.params.id);
    res.json({
      message: 'deleted',
      changes: result.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

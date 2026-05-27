const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los clientes
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM cliente').all();
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar un cliente por ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM cliente WHERE id = ?').get(req.params.id);
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insertar un nuevo cliente
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO cliente (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)');
    const info = stmt.run(nombre, apellido, email, telefono);
    res.json({
      message: 'success',
      data: { id: info.lastInsertRowid, nombre, apellido, email, telefono },
      id: info.lastInsertRowid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un cliente
router.put('/:id', (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  try {
    const stmt = db.prepare('UPDATE cliente SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?');
    const info = stmt.run(nombre, apellido, email, telefono, req.params.id);
    res.json({
      message: 'success',
      data: { id: req.params.id, nombre, apellido, email, telefono },
      changes: info.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un cliente
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM cliente WHERE id = ?');
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

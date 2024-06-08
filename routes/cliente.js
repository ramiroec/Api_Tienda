const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los clientes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM cliente';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// Listar un cliente por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM cliente WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": row
    });
  });
});

// Insertar un nuevo cliente
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  const sql = 'INSERT INTO cliente (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';
  const params = [nombre, apellido, email, telefono];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, nombre, apellido, email, telefono },
      "id": this.lastID
    });
  });
});

// Actualizar un cliente
router.put('/:id', (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  const sql = 'UPDATE cliente SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?';
  const params = [nombre, apellido, email, telefono, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: req.params.id, nombre, apellido, email, telefono },
      "changes": this.changes
    });
  });
});

// Eliminar un cliente
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM cliente WHERE id = ?';
  const params = [req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "deleted",
      "changes": this.changes
    });
  });
});

module.exports = router;

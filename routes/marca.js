const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todas las marcas
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM marca';
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

// Listar una marca por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM marca WHERE id = ?';
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

// Insertar una nueva marca
router.post('/', (req, res) => {
  const { nombre } = req.body;
  const sql = 'INSERT INTO marca (nombre) VALUES (?)';
  const params = [nombre];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, nombre },
      "id": this.lastID
    });
  });
});

// Actualizar una marca
router.put('/:id', (req, res) => {
  const { nombre } = req.body;
  const sql = 'UPDATE marca SET nombre = ? WHERE id = ?';
  const params = [nombre, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: req.params.id, nombre },
      "changes": this.changes
    });
  });
});

// Eliminar una marca
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM marca WHERE id = ?';
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

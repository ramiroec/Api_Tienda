const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los productos
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM producto';
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

// Listar un producto por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM producto WHERE id = ?';
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

// Insertar un nuevo producto
router.post('/', (req, res) => {
  const { nombre, precio, foto, disponibilidad, id_marca } = req.body;
  const sql = 'INSERT INTO producto (nombre, precio, foto, disponibilidad, id_marca) VALUES (?, ?, ?, ?, ?)';
  const params = [nombre, precio, foto, disponibilidad, id_marca];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, nombre, precio, foto, disponibilidad, id_marca },
      "id": this.lastID
    });
  });
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const { nombre, precio, foto, disponibilidad, id_marca } = req.body;
  const sql = 'UPDATE producto SET nombre = ?, precio = ?, foto = ?, disponibilidad = ?, id_marca = ? WHERE id = ?';
  const params = [nombre, precio, foto, disponibilidad, id_marca, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: req.params.id, nombre, precio, foto, disponibilidad, id_marca },
      "changes": this.changes
    });
  });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM producto WHERE id = ?';
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

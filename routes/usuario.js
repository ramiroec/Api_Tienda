const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los usuarios
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM usuario';
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

// Listar un usuario por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM usuario WHERE id = ?';
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

// Insertar un nuevo usuario
router.post('/', (req, res) => {
  const { nombre_usuario, contrasena, nombre, apellido, rol } = req.body;
  const sql = 'INSERT INTO usuario (nombre_usuario, contrasena, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)';
  const params = [nombre_usuario, contrasena, nombre, apellido, rol];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, nombre_usuario, contrasena, nombre, apellido, rol },
      "id": this.lastID
    });
  });
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
  const { nombre_usuario, contrasena, nombre, apellido, rol } = req.body;
  const sql = 'UPDATE usuario SET nombre_usuario = ?, contrasena = ?, nombre = ?, apellido = ?, rol = ? WHERE id = ?';
  const params = [nombre_usuario, contrasena, nombre, apellido, rol, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: req.params.id, nombre_usuario, contrasena, nombre, apellido, rol },
      "changes": this.changes
    });
  });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM usuario WHERE id = ?';
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

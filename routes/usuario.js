const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los usuarios
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM usuario').all();
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar un usuario por ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM usuario WHERE id = ?').get(req.params.id);
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insertar un nuevo usuario
router.post('/', (req, res) => {
  const { nombre_usuario, contrasena, nombre, apellido, rol } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO usuario (nombre_usuario, contrasena, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(nombre_usuario, contrasena, nombre, apellido, rol);
    res.json({
      message: 'success',
      data: {
        id: result.lastInsertRowid,
        nombre_usuario,
        contrasena,
        nombre,
        apellido,
        rol
      },
      id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
  const { nombre_usuario, contrasena, nombre, apellido, rol } = req.body;
  try {
    const stmt = db.prepare('UPDATE usuario SET nombre_usuario = ?, contrasena = ?, nombre = ?, apellido = ?, rol = ? WHERE id = ?');
    const result = stmt.run(nombre_usuario, contrasena, nombre, apellido, rol, req.params.id);
    res.json({
      message: 'success',
      data: {
        id: req.params.id,
        nombre_usuario,
        contrasena,
        nombre,
        apellido,
        rol
      },
      changes: result.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM usuario WHERE id = ?');
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

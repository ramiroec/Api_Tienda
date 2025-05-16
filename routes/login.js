const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Ruta para iniciar sesión
router.post('/', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  try {
    const stmt = db.prepare('SELECT * FROM usuario WHERE nombre_usuario = ? AND contrasena = ?');
    const row = stmt.get(nombre_usuario, contrasena);

    if (!row) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Si las credenciales son correctas, devolver el usuario
    res.json({
      message: 'success',
      data: row
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
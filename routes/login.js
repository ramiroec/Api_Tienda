const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Ruta para iniciar sesión
router.post('/', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  const sql = 'SELECT * FROM usuario WHERE nombre_usuario = ? AND contrasena = ?';
  const params = [nombre_usuario, contrasena];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      res.status(401).json({ "error": "Credenciales incorrectas" });
      return;
    }
    // Si las credenciales son correctas, devolver el usuario
    res.json({
      "message": "success",
      "data": row
    });
  });
});

module.exports = router;

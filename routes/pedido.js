const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los pedidos
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM pedido').all();
    res.json({ message: 'success', data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar un pedido por ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM pedido WHERE id = ?').get(req.params.id);
    if (!row) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }
    res.json({ message: 'success', data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insertar un nuevo pedido
router.post('/', (req, res) => {
  const { cliente_id, fecha, total, detalles } = req.body;

  try {
    const insertPedido = db.prepare('INSERT INTO pedido (cliente_id, fecha, total) VALUES (?, ?, ?)');
    const resultPedido = insertPedido.run(cliente_id, fecha, total);
    const pedidoId = resultPedido.lastInsertRowid;

    const insertDetalle = db.prepare('INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)');
    const insertMany = db.transaction((detalles) => {
      for (const detalle of detalles) {
        insertDetalle.run(pedidoId, detalle.id_producto, detalle.cantidad, detalle.precio);
      }
    });

    insertMany(detalles);

    res.json({
      message: 'success',
      data: { id: pedidoId, cliente_id, fecha, total, detalles }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un pedido
router.put('/:id', (req, res) => {
  const { cliente_id, fecha, total } = req.body;
  try {
    const stmt = db.prepare('UPDATE pedido SET cliente_id = ?, fecha = ?, total = ? WHERE id = ?');
    const info = stmt.run(cliente_id, fecha, total, req.params.id);
    res.json({
      message: 'success',
      data: { id: req.params.id, cliente_id, fecha, total },
      changes: info.changes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un pedido
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM pedido WHERE id = ?');
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

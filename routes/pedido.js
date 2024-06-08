const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Listar todos los pedidos
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM pedido';
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

// Listar un pedido por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM pedido WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ "error": "Pedido no encontrado" });
      return;
    }
    res.json({
      "message": "success",
      "data": row
    });
  });
});

// Insertar un nuevo pedido
router.post('/', (req, res) => {
  const { cliente_id, fecha, total, detalles } = req.body;
  const sqlPedido = 'INSERT INTO pedido (cliente_id, fecha, total) VALUES (?, ?, ?)';
  const paramsPedido = [cliente_id, fecha, total];

  db.run(sqlPedido, paramsPedido, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    const pedidoId = this.lastID;
    const detallesPedido = detalles.map(detalle => [pedidoId, detalle.id_producto, detalle.cantidad, detalle.precio]);
    const sqlDetalles = 'INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)';

    db.serialize(() => {
      detallesPedido.forEach(detalle => {
        db.run(sqlDetalles, detalle, function (err) {
          if (err) {
            res.status(400).json({ "error": err.message });
            return;
          }
        });
      });

      res.json({
        "message": "success",
        "data": { id: pedidoId, cliente_id, fecha, total, detalles }
      });
    });
  });
});

// Actualizar un pedido
router.put('/:id', (req, res) => {
  const { cliente_id, fecha, total } = req.body;
  const sql = 'UPDATE pedido SET cliente_id = ?, fecha = ?, total = ? WHERE id = ?';
  const params = [cliente_id, fecha, total, req.params.id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: req.params.id, cliente_id, fecha, total },
      "changes": this.changes
    });
  });
});

// Eliminar un pedido
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM pedido WHERE id = ?';
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

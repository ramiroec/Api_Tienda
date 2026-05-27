const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const marcaRouter = require('./rutas/marca');
const usuarioRouter = require('./rutas/usuario');
const productoRouter = require('./rutas/producto');
const clienteRouter = require('./rutas/cliente');
const pedidoRouter = require('./rutas/pedido');
const loginRouter = require('./rutas/login'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mostrar información de cada solicitud en la consola
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

// Rutas de la API
app.use('/marca', marcaRouter);
app.use('/usuario', usuarioRouter);
app.use('/producto', productoRouter);
app.use('/cliente', clienteRouter);
app.use('/pedido', pedidoRouter);
app.use('/login', loginRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

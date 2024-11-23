const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const marcaRouter = require('./routes/marca');
const usuarioRouter = require('./routes/usuario');
const productoRouter = require('./routes/producto');
const clienteRouter = require('./routes/cliente');
const pedidoRouter = require('./routes/pedido');
const loginRouter = require('./routes/login'); // Nueva línea
//Aqui pongo un comentario.
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Middleware de logging personalizado
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationInMilliseconds.toLocaleString()} ms`);
  });
  next();
});

// Función para calcular la duración
function getDurationInMilliseconds(start) {
  const NS_PER_SEC = 1e9; // Convertir nanosegundos a segundos
  const NS_TO_MS = 1e6; // Convertir nanosegundos a milisegundos
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}



// Rutas de la API
app.use('/marca', marcaRouter);
app.use('/usuario', usuarioRouter);
app.use('/producto', productoRouter);
app.use('/cliente', clienteRouter);
app.use('/pedido', pedidoRouter);
app.use('/login', loginRouter); // Nueva línea

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

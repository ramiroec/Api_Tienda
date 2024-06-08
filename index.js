const express = require('express');
const bodyParser = require('body-parser');
const marcaRouter = require('./routes/marca');
const usuarioRouter = require('./routes/usuario');
const productoRouter = require('./routes/producto');
const clienteRouter = require('./routes/cliente');
const pedidoRouter = require('./routes/pedido');
const loginRouter = require('./routes/login'); // Nueva línea

const app = express();
app.use(bodyParser.json());

// Rutas de la API
app.use('/marca', marcaRouter);
app.use('/usuario', usuarioRouter);
app.use('/producto', productoRouter);
app.use('/cliente', clienteRouter);
app.use('/pedido', pedidoRouter);
app.use('/login', loginRouter); // Nueva línea

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

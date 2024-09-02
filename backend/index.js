const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routerUsuario = require('./routes/usuariosRoutes');
app.use('/usuario', routerUsuario);
 
const routerReclamo = require('./routes/reclamosRoutes');
app.use('/reclamos', routerReclamo);

const routerProducto = require('./routes/productosRoutes');
app.use('/productos', routerProducto);

const routerPedidos = require('./routes/pedidosRoutes');
app.use('/pedidos', routerPedidos);
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

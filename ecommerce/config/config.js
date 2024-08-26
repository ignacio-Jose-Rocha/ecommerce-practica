const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ignacio',
  database: 'ecommerce',
  multipleStatements: true
};

const connection = mysql.createConnection(dbConfig);

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); 
  }
  console.log('Conexión exitosa a la base de datos.');
});

app.use(express.json());

const usersRoutes = require('../routes/usuarioRoutes');
app.use('/api/usuarios', usersRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = connection;

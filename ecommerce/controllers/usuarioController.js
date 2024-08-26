
const db = require('../config.js');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(results[0]);
  });
};

exports.createUser = (req, res) => {
  const { nombre, apellido, direccion, email, contrasena, foto } = req.body;
  db.query(
    'INSERT INTO usuarios (nombre, apellido, direccion, email, contrasena, foto) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, apellido, direccion, email, contrasena, foto],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Usuario creado', id: results.insertId });
    }
  );
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, direccion, email, contrasena, foto } = req.body;
  db.query(
    'UPDATE usuarios SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ? WHERE id_usuario = ?',
    [nombre, apellido, direccion, email, contrasena, foto, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Usuario actualizado' });
    }
  );
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Usuario eliminado' });
  });
};

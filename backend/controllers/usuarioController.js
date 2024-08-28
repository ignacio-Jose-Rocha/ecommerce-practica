const pool = require('../config.js');

exports.getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

exports.createUsuario = async (req, res) => {
  const { nombre,apellido, direccion, email,contrasena, foto,fecha_registro } = req.body;
  try {
    const [rows] = await pool.query('INSERT INTO usuarios (nombre,apellido, direccion, email,contrasena, foto,fecha_registro) VALUES (?, ?, ?,?, ?, ?,?)', [nombre,apellido, direccion, email,contrasena, foto,fecha_registro]);
    res.json({
      id: rows.insertId,
      nombre,
      apellido,
      direccion,
      email,
      contrasena,
      foto,
      fecha_registro
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre,apellido, direccion, email,contrasena, foto,fecha_registro } = req.body;
  try {
    const [rows] = await pool.query('UPDATE usuarios SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ?, fecha_registro = ? WHERE id_usuario = ?', [nombre,apellido, direccion, email,contrasena, foto,fecha_registro, id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({
      id,
      nombre,
      apellido,
      direccion,
      email,
      contrasena,
      foto,
      fecha_registro
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al borrar el usuario:', error);
    res.status(500).json({ error: 'Error al borrar el usuario' });
  }
}
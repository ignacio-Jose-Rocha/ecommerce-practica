const pool = require('../config.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

const crearTransportadorEthereal = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "ignacio.jose.pancho@outlook.com",
    pass: "Nro19975@gmail.com",
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

async function verificarUsuario(req, res) {
  try {
    const { token_verificacion } = req.params; 
    if (!token_verificacion) {
      return res.status(400).json({ error: 'Token de verificación no proporcionado.' });
    }

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE token_verificacion = ?', [token_verificacion]);
    console.log(rows)
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o token inválido.' });
    }

    await pool.query('UPDATE usuarios SET registrado = 1, token_verificacion = NULL WHERE token_verificacion = ?', [token_verificacion]);

    res.status(200).json({ mensaje: 'Usuario verificado con éxito.' });
  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    res.status(500).json({ error: 'Error al verificar el usuario.' });
  }
}
exports.verificarUsuario = verificarUsuario;

async function enviarCorreoVerificacion(email, enlaceVerificacion) {
  let transportador = crearTransportadorEthereal;

  let info = await transportador.sendMail({
    from: '"Nombre del Remitente" <ignacio.jose.pancho@outlook.com>',
    to: email,
    subject: "Verifica tu cuenta",
    html: `<p>Felicidades, verificó su registro a nuestra plataforma.</p><p>Haz clic en el siguiente enlace para verificar tu cuenta: <a href="${enlaceVerificacion}">${enlaceVerificacion}</a></p>`, // cuerpo del correo en HTML
  });

  console.log("Mensaje enviado: %s", info.messageId);
}

exports.createUsuario = async (req, res) => {
  const { nombre, apellido, direccion, email, contrasena, foto, fecha_registro } = req.body;
  const token_verificacion = crypto.randomBytes(20).toString('hex'); 

  try {
    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido, direccion, email, contrasena, foto, fecha_registro, token_verificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellido, direccion, email, contrasena, foto, fecha_registro, token_verificacion]);

    await enviarCorreoVerificacion(email, `http://localhost:5173/verificar/${token_verificacion}`);

    res.status(201).json({
      id: result.insertId,
      nombre,
      apellido,
      direccion,
      email,
      contrasena,
      foto,
      fecha_registro,
      token_verificacion
    });
    
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};



exports.updateUsuario = async (req, res) => { 
  const { id } = req.params;
  const { nombre, apellido, direccion, email, contrasena, foto, fecha_registro } = req.body;
  try {
    const [rows] = await pool.query('UPDATE usuarios SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ?, fecha_registro = ? WHERE id_usuario = ?', [nombre, apellido, direccion, email, contrasena, foto, fecha_registro, id]);
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
};

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
};

exports.loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND contrasena = ?', [email, contrasena]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

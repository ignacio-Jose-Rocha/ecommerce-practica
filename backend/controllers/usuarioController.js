const pool = require('../config.js');
const nodemailer = require('nodemailer');

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


async function enviarCorreoVerificacion(email, nombre, apellido) {
  let transportador = crearTransportadorEthereal;

  let info = await transportador.sendMail({
    from: 'ecommerce verificacion <ignacio.jose.pancho@outlook.com>',
    to: email,
    subject: "Registro exitoso",
    html: `<p>Felicidades ${nombre} ${apellido}, tu correo ha sido verificado exitosamente</p>`,
  });

  console.log("Mensaje enviado: %s", info.messageId);
}

exports.createUsuario = async (req, res) => {
  const { nombre, apellido, direccion, email, contrasena, foto, fecha_registro } = req.body;

  try {
  
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

 
    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido, direccion, email, contrasena, foto, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, apellido, direccion, email, contrasena, foto, fecha_registro]);


    await enviarCorreoVerificacion(email, nombre, apellido);

    res.status(201).json({
      id: result.insertId,
      nombre,
      apellido,
      direccion,
      email,
      contrasena,
      foto,
      fecha_registro,
    });
    
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


async function enviarCorreoActualizacion(email, nombre, apellido) {
  let transportador = crearTransportadorEthereal;

  let info = await transportador.sendMail({
    from: 'ecommerce verificacion <ignacio.jose.pancho@outlook.com>',
    to: email,
    subject: "Actualización de perfil exitosa",
    html: `<p>Hola ${nombre} ${apellido}, tus datos han sido actualizados correctamente.</p>`,
  });

  console.log("Mensaje de actualización enviado: %s", info.messageId);
}

exports.updateUsuario = async (req, res) => { 
  const { id } = req.params;
  const { nombre, apellido, direccion, email, contrasena, foto, fecha_registro } = req.body;
  try {
    const [rows] = await pool.query('UPDATE usuarios SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ?, fecha_registro = ? WHERE id_usuario = ?', [nombre, apellido, direccion, email, contrasena, foto, fecha_registro, id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await enviarCorreoActualizacion(email, nombre, apellido);

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
    await pool.query('UPDATE usuarios SET logueado = 1 WHERE email = ?', [email]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario o al actualizar el estado de logueado:', error);
    res.status(500).json({ error: 'Error al obtener el usuario o al actualizar el estado de logueado' });
  }
};

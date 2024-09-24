const pool = require('../config.js');
const nodemailer = require('nodemailer');

exports.getAllUsuariosClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE rol = "cliente"');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

exports.getAllUsuariosadministrador = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE rol = "administrador"');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
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
  const { nombre, apellido, direccion, email, contrasena, foto } = req.body;

  try {
    const query = `INSERT INTO clientes (nombre, apellido, direccion, email, contrasena, foto, rol, estado_logueo) VALUES (?, ?, ?, ?, ?, ?, 'cliente', FALSE)`;
    const [result] = await pool.execute(query, [nombre, apellido, direccion, email, contrasena, foto]);

    await enviarCorreoVerificacion(email, nombre, apellido);

    res.status(201).send({ message: "Usuario creado exitosamente", userId: result.insertId });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).send({ message: "Error al crear el usuario" });
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
  const { nombre, apellido, direccion, email, contrasena, foto } = req.body; 
  try {
    const [rows] = await pool.query('UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ? WHERE id_cliente = ?', [nombre, apellido, direccion, email, contrasena, foto, id]);
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
      foto
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
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
    const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ? AND contrasena = ?', [email, contrasena]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await pool.query(`UPDATE clientes SET estado_logueo = ${1} WHERE email = ?`, [email]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario o al actualizar el estado de logueado:', error);
    res.status(500).json({ error: 'Error al obtener el usuario o al actualizar el estado de logueado' });
  }
};

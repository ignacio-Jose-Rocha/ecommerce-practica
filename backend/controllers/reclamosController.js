const pool = require('../config.js');
const nodemailer = require('nodemailer');

exports.getAllReclamos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reclamos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los reclamos:', error);
        res.status(500).json({ error: 'Error al obtener los reclamos' });
    }
};
exports.getReclamoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM reclamos WHERE id_reclamo = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reclamo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el reclamo:', error);
        res.status(500).json({ error: 'Error al obtener el reclamo' });
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
      from: 'ecommerce inicio de reclamo <ignacio.jose.pancho@outlook.com>',
      to: email,
      subject: "Creacion de reclamo exitoso",
      html: `<p>Felicidades ${nombre} ${apellido}, su reclamo a sido iniciado</p>`,
    });
  
    console.log("Mensaje enviado: %s", info.messageId);
  }
  exports.createReclamo = async (req, res) => {
    const { nombre, apellido, descripcion, fecha_reclamo } = req.body; 
    
    try {
        const [usuarios] = await pool.query('SELECT email FROM usuarios WHERE nombre = ? AND apellido = ?', [nombre, apellido]);
        
        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const email = usuarios[0].email; 
        
        const [result] = await pool.query('INSERT INTO reclamos (nombre, descripcion, estado, fecha_reclamo) VALUES (?, ?, "abierto", ?)', [nombre, descripcion, fecha_reclamo]);
        
         try {
            await enviarCorreoVerificacion(email, nombre, apellido); 
            console.log("Correo de verificación enviado con éxito.");
        } catch (errorCorreo) {
            console.error('Error al enviar el correo de verificación:', errorCorreo);
            res.status(500).json({ error: 'Error al enviar el correo de verificación' });
        }
        
        res.status(201).json({
            id_reclamo: result.insertId,
            nombre,
            descripcion,
            estado: 'abierto',
            fecha_reclamo
        });
    } catch (error) {
        console.error('Error al crear el reclamo:', error);
        res.status(500).json({ error: 'Error al crear el reclamo' });
    }
};
async function enviarCorreo(email, asunto, cuerpo) {
    let transportador = crearTransportadorEthereal;
  
    let info = await transportador.sendMail({
      from: 'ecommerce inicio de reclamo <ignacio.jose.pancho@outlook.com>',
      to: email,
      subject: asunto,
      html: cuerpo,
    });
  
    console.log("Mensaje enviado: %s", info.messageId);
  }
  exports.actualizarReclamo = async (req, res) => {
    const { id } = req.params;
    const { estado, descripcion } = req.body;

    try {
        const [result] = await pool.query('UPDATE reclamos SET estado = ?, descripcion = ? WHERE id_reclamo = ?', [estado, descripcion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reclamo no encontrado' });
        }

        const [rows] = await pool.query('SELECT email FROM usuarios JOIN reclamos ON usuarios.nombre = reclamos.nombre  AND usuarios.apellido = reclamos.apellido WHERE reclamos.id_reclamo = ?', [id]);
        if (rows.length > 0) {
            const email = rows[0].email;
            try {
                await enviarCorreo(email, "Actualización de reclamo", `<p>Su reclamo ha sido actualizado a estado: ${estado}. Descripción: ${descripcion}</p>`);
                console.log("Correo de actualización enviado con éxito.");
            } catch (errorCorreo) {
                console.error('Error al enviar el correo de actualización:', errorCorreo);
               
            }
        }
        res.json({ message: 'Reclamo actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el reclamo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
  
const pool = require('../config.js');
const crypto = require('crypto');

exports.getAllMetodosPago = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM metodos_pago');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los metodos de pago:', error);
        res.status(500).json({ error: 'Error al obtener los metodos de pago' });
    }
}
exports.getMetodosById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM metodos_pago WHERE id_metodo_pago = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Metodo de pago no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el metodo de pago:', error);
        res.status(500).json({ error: 'Error al obtener el metodo de pago' });
    }
}
function encriptar(texto) {
    const algoritmo = 'aes-256-cbc';
    const clave = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv(algoritmo, Buffer.from(clave), iv);
    let textoEncriptado = cipher.update(texto);
    textoEncriptado = Buffer.concat([textoEncriptado, cipher.final()]);

    return { iv: iv.toString('hex'), textoEncriptado: textoEncriptado.toString('hex') };
}
function descifrar(textoEncriptado, claveHex, ivHex) {
    const algoritmo = 'aes-256-cbc';
    const clave = Buffer.from(claveHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    let decipher = crypto.createDecipheriv(algoritmo, clave, iv);
    let textoDescifrado = decipher.update(Buffer.from(textoEncriptado, 'hex'));
    textoDescifrado = Buffer.concat([textoDescifrado, decipher.final()]);

    return textoDescifrado.toString();
}

exports.cargarMetodosPago = async (req, res) => {
    const { id_cliente, tipo, nombre_titular, numero_tarjeta, fecha_expiracion, cvv } = req.body;
    const numeroTarjetaEncriptado = encriptar(numero_tarjeta);


    try {
        await pool.query('INSERT INTO metodos_pago (id_cliente, tipo, nombre_titular, numero_tarjeta, fecha_expiracion, cvv, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())', [id_cliente, tipo, nombre_titular, JSON.stringify(numeroTarjetaEncriptado), fecha_expiracion, cvv]);
        res.json({ mensaje: 'Método de pago cargado con éxito ' });
   } catch (error) {
        console.error('Error al cargar el método de pago:', error);
        res.status(500).json({ error: 'Error al cargar el método de pago' });
    }
}

exports.deleteMetodosPago = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM metodos_pago WHERE id_metodo_pago = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Metodo de pago no encontrado' });
        }
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al borrar el metodo de pago:', error);
        res.status(500).json({ error: 'Error al borrar el metodo de pago' });
    }
}

exports.updateMetodosPago = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, tipo, nombre_titular, numero_tarjeta, fecha_expiracion, cvv } = req.body;
    const numeroTarjetaEncriptado = encriptar(numero_tarjeta);
    try {
        const [result] = await pool.query('UPDATE metodos_pago SET id_cliente = ?, tipo = ?, nombre_titular = ?, numero_tarjeta = ?, fecha_expiracion = ?, cvv = ? WHERE id_metodo_pago = ?', [id_cliente, tipo, nombre_titular, JSON.stringify(numeroTarjetaEncriptado), fecha_expiracion, cvv, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Metodo de pago no encontrado' });
        }
        res.json({ mensaje: 'Metodo de pago actualizado con éxito' });
    }   catch (error) {
        console.error('Error al actualizar el metodo de pago:', error);
        res.status(500).json({ error: 'Error al actualizar el metodo de pago' });
    }
}
const pool = require('../config.js');

exports.getAllCarrito = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM carrito');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
};
exports.getCarritoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM carrito WHERE id_carrito = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};
exports.crearCarrito = async (req, res) => {
    const { id_cliente } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO carrito (id_cliente) VALUES (?)', [id_cliente]);
        res.status(201).json({
            id_carrito: rows.insertId,
            id_cliente
        });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};
exports.editarCarrito = async (req, res) => {
    const { id } = req.params;
    const { id_cliente } = req.body;
    try {
        const [result] = await pool.query('UPDATE carrito SET id_cliente = ? WHERE id_carrito = ?', [id_cliente, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};
exports.eliminarCarrito = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM carrito WHERE id_carrito = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
}   
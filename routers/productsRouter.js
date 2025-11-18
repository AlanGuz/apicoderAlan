const express = require('express');
const router = express.Router();

const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});


router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
});


router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        // Emitir a websockets
        const io = req.app.get('io');
        io.emit('product-added', newProduct);

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.put('/:pid', async (req, res) => {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
});


router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);

    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

    // Emitir evento de eliminación
    const io = req.app.get('io');
    io.emit('product-deleted', req.params.pid);

    res.json({ status: "success" });
});

module.exports = router;

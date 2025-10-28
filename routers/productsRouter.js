const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const pm = new ProductManager();

router.get('/', async (req, res, next) => {
  try {
    const products = await pm.getProducts();
    res.json({ status: 'success', payload: products });
  } catch (err) { next(err); }
});

router.get('/:pid', async (req, res, next) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.put('/:pid', async (req, res, next) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.delete('/:pid', async (req, res, next) => {
  try {
    const ok = await pm.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (err) { next(err); }
});

module.exports = router;

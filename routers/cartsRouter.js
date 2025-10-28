const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (req, res, next) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (err) { next(err); }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart.products });
  } catch (err) { next(err); }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const product = await pm.getProductById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const cart = await cm.addProductToCart(cid, pid, 1);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: cart });
  } catch (err) { next(err); }
});

module.exports = router;

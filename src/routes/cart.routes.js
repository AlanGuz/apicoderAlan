const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', (req, res) => cartController.createCart(req, res));
router.get('/:cid', (req, res) => cartController.getCartById(req, res));

// add product to cart (existing behavior)
router.post('/:cid/product/:pid', (req, res) => cartController.addProductToCart(req, res));

// NEW endpoints required
router.delete('/:cid/products/:pid', (req, res) => cartController.deleteProductFromCart(req, res));
router.put('/:cid', (req, res) => cartController.updateCartProducts(req, res));
router.put('/:cid/products/:pid', (req, res) => cartController.updateProductQuantity(req, res));
router.delete('/:cid', (req, res) => cartController.clearCart(req, res));

module.exports = router;

const express = require('express');
const router = express.Router();

const ProductService = require('../services/product.service');
const CartService = require('../services/cart.service');

const productService = new ProductService();
const cartService = new CartService();

// HOME
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAll({ limit: 10, page: 1 });
    res.render('home', { products: products.docs });
  } catch (err) {
    console.error("Error renderizando HOME:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// LISTA DE PRODUCTOS CON PAGINACIÓN
router.get('/products', async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const result = await productService.getAll({ limit, page, sort, query });

    res.render('products', {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
      },
      query: req.query
    });
  } catch (err) {
    console.error("Error listando productos:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// DETALLE DE PRODUCTO
router.get('/products/:pid', async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render('productDetail', { product });
  } catch (err) {
    console.error("Error en detalle de producto:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// DETALLE DE CARRITO
router.get('/carts/:cid', async (req, res, next) => {
  try {
    const cart = await cartService.getById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render('cart', { cart });
  } catch (err) {
    console.error("Error en carrito:", err);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;

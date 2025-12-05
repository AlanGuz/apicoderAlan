const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/:pid', (req, res) => productController.getProductById(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.put('/:pid', (req, res) => productController.updateProduct(req, res));
router.delete('/:pid', (req, res) => productController.deleteProduct(req, res));

module.exports = router;

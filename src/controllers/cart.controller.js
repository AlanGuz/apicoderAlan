const CartService = require('../services/cart.service');
const cartService = new CartService();

class CartController {
  async createCart(req, res) {
    try {
      const cart = await cartService.create();
      res.status(201).json({ status: 'success', payload: cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cart = await cartService.getById(req.params.cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      res.json({ status: 'success', payload: cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updated = await cartService.addProduct(cid, pid, 1);
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updated = await cartService.removeProduct(cid, pid);
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async updateCartProducts(req, res) {
    try {
      const { cid } = req.params;
      const productsArray = req.body; // expect array [{ product, quantity }]
      const updated = await cartService.updateCartProducts(cid, productsArray);
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updated = await cartService.updateProductQuantity(cid, pid, Number(quantity));
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const updated = await cartService.clearCart(cid);
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = new CartController();

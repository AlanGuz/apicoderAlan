const CartDAO = require('../dao/carts/cart.mongo');

class CartService {
  constructor() {
    this.dao = new CartDAO();
  }

  async create() {
    return this.dao.create();
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async addProduct(cid, pid, qty) {
    return this.dao.addProduct(cid, pid, qty);
  }

  async removeProduct(cid, pid) {
    return this.dao.removeProduct(cid, pid);
  }

  async updateCartProducts(cid, productsArray) {
    return this.dao.updateCartProducts(cid, productsArray);
  }

  async updateProductQuantity(cid, pid, qty) {
    return this.dao.updateProductQuantity(cid, pid, qty);
  }

  async clearCart(cid) {
    return this.dao.clearCart(cid);
  }
}

module.exports = CartService;


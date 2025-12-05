const CartModel = require('../../models/cart.model');

class CartMongoDAO {
  async create() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  async getById(cid) {
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async addProduct(cid, productId, qty = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Cart not found');

    const idx = cart.products.findIndex(p => p.product.toString() === productId);
    if (idx === -1) {
      cart.products.push({ product: productId, quantity: qty });
    } else {
      cart.products[idx].quantity += qty;
    }
    await cart.save();
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async updateCartProducts(cid, productsArray) {
    // productsArray: [{ product: productId, quantity }]
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Cart not found');

    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async updateProductQuantity(cid, pid, qty) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Cart not found');

    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx === -1) throw new Error('Product not in cart');

    cart.products[idx].quantity = qty;
    await cart.save();
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async removeProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Cart not found');

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Cart not found');
    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}

module.exports = CartMongoDAO;

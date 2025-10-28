const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filename = 'carts.json') {
    this.filePath = path.join(__dirname, '..', 'data', filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, '[]', 'utf8');
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  _generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: this._generateId(),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return null;

    const cart = carts[idx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(pid));

    if (prodIdx === -1) {
      cart.products.push({ product: String(pid), quantity: Number(quantity) });
    } else {
      cart.products[prodIdx].quantity = Number(cart.products[prodIdx].quantity) + Number(quantity);
    }

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;

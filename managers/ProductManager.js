const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filename = 'products.json') {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(pid) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(pid)) || null;
  }

  async addProduct(productData) {
    const required = ['title','description','code','price','status','stock','category','thumbnails'];
    for (const r of required) {
      if (!Object.prototype.hasOwnProperty.call(productData, r)) {
        throw new Error(`Falta campo requerido: ${r}`);
      }
    }

    const products = await this._readFile();

    if (products.some(p => p.code === productData.code)) {
      throw new Error('Ya existe un producto con ese code');
    }

    const newProduct = {
      id: this._generateId(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(pid, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return null;

    if ('id' in updateData) delete updateData.id;

    const updated = { ...products[idx], ...updateData };

    if (updated.price !== undefined) updated.price = Number(updated.price);
    if (updated.stock !== undefined) updated.stock = Number(updated.stock);
    if (updated.status !== undefined) updated.status = Boolean(updated.status);
    if (updated.thumbnails && !Array.isArray(updated.thumbnails)) {
      updated.thumbnails = Array.isArray(products[idx].thumbnails) ? products[idx].thumbnails : [];
    }

    products[idx] = updated;
    await this._writeFile(products);
    return updated;
  }

  async deleteProduct(pid) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;

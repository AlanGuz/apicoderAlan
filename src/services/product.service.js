const ProductDAO = require('../dao/products/product.mongo');

class ProductService {
  constructor() {
    this.dao = new ProductDAO();
  }

  async create(data) {
    return this.dao.create(data);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }

  async delete(id) {
    return this.dao.delete(id);
  }

  async getAll(queryParams) {
    return this.dao.getAll(queryParams);
  }
}

module.exports = ProductService;

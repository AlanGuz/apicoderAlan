const ProductService = require('../services/product.service');
const productService = new ProductService();

function buildLink(baseUrl, params) {
  // params is an object with page, limit, sort, query
  const qs = new URLSearchParams(params);
  return `${baseUrl}?${qs.toString()}`;
}

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const result = await productService.getAll({ limit, page, sort, query });

      const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

      const prevPage = result.hasPrevPage ? Number(result.page) - 1 : null;
      const nextPage = result.hasNextPage ? Number(result.page) + 1 : null;

      const prevLink = prevPage ? buildLink(baseUrl, { ...req.query, page: prevPage }) : null;
      const nextLink = nextPage ? buildLink(baseUrl, { ...req.query, page: nextPage }) : null;

      res.json({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage,
        nextPage,
        page: Number(result.page),
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
      });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getById(req.params.pid);
      if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: product });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  async createProduct(req, res) {
    try {
      const newP = await productService.create(req.body);
      res.status(201).json({ status: 'success', payload: newP });
    } catch (err) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const updated = await productService.update(req.params.pid, req.body);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: updated });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deleted = await productService.delete(req.params.pid);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = new ProductController();

const ProductService = require('../services/product.service');

const productService = new ProductService();

function buildLink(baseUrl, params) {
  const qs = new URLSearchParams(params);
  return `${baseUrl}?${qs.toString()}`;
}

class ProductController {
  async getProducts(req, res, next) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const result = await productService.getAll({
        limit,
        page,
        sort,
        query
      });

      const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

      const prevPage = result.hasPrevPage ? result.page - 1 : null;
      const nextPage = result.hasNextPage ? result.page + 1 : null;

      res.json({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage,
        nextPage,
        prevLink: prevPage ? buildLink(baseUrl, { ...req.query, page: prevPage }) : null,
        nextLink: nextPage ? buildLink(baseUrl, { ...req.query, page: nextPage }) : null
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getById(req.params.pid);
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success', payload: product });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const newProduct = await productService.create(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updated = await productService.update(req.params.pid, req.body);
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success', payload: updated });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const deleted = await productService.delete(req.params.pid);
      if (!deleted) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

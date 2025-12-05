const ProductModel = require('../../models/product.model');

class ProductMongoDAO {
  async create(payload) {
    const prod = await ProductModel.create(payload);
    return prod.toObject();
  }

  async getById(id) {
    return ProductModel.findById(id).lean();
  }

  async update(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    const r = await ProductModel.findByIdAndDelete(id);
    return r != null;
  }

  // Consulta compleja con paginado
  async getAll({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    // Si query es 'true' o 'false' lo tratamos como status
    if (typeof query !== 'undefined') {
      const qLower = String(query).toLowerCase();
      if (qLower === 'true' || qLower === 'false') {
        filter.status = qLower === 'true';
      } else {
        // lo tratamos como category
        filter.category = String(query);
      }
    }

    const options = {};
    const skip = (page - 1) * limit;

    let cursor = ProductModel.find(filter);

    if (sort === 'asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'desc') cursor = cursor.sort({ price: -1 });

    const totalDocs = await ProductModel.countDocuments(filter);
    const results = await cursor.skip(skip).limit(Number(limit)).lean();

    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs: results,
      totalDocs,
      limit: Number(limit),
      page: Number(page),
      totalPages,
      hasPrevPage,
      hasNextPage
    };
  }
}

module.exports = ProductMongoDAO;

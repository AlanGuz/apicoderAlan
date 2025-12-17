const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, index: true },
    status: { type: Boolean, default: true, index: true },
    stock: { type: Number, default: 0 },
    category: { type: String, index: true },
    thumbnails: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);


productSchema.index({ category: 1, price: 1 });

module.exports = model('Product', productSchema);


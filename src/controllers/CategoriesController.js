import Categories from '../models/Categories.js';
import Products from '../models/Products.js';

class CategoriesController {
  // GET
  async getAll(req, res, next) {
    const { offset, limit, store } = req.query;

    try {
      const categories = await Categories.paginate(
        { store },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          select: '_id products name availability code store',
          sort: { createdAt: -1 },
        },
      );

      return res.json({ categories });
    } catch (err) {
      return next(err);
    }
  }

  // GET /disponiveis
  async getAllAvailables(req, res, next) {
    const { offset, limit, store } = req.query;

    try {
      const categories = await Categories.paginate(
        { store, availability: true },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          select: '_id products name availability code store',
          sort: { createdAt: -1 },
        },
      );

      return res.json({ categories });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id
  async getById(req, res, next) {
    const { id } = req.params;

    try {
      const category = await Categories.findById(id)
        .select('_id products name availability code store')
        .populate(['products']);

      if (!category)
        return res.status(400).json({ error: 'Categoria não encontrada.' });

      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  }

  // GET /search/:search
  async search(req, res, next) {
    const { offset, limit, store } = req.query;
    const { search } = req.params;

    const regex = new RegExp(search, 'i');

    try {
      const categories = await Categories.paginate(
        {
          store,
          $or: [{ name: { $regex: regex } }, { code: { $regex: regex } }],
        },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          select: '_id products name availability code store',
          sort: { createdAt: -1 },
        },
      );

      return res.json({ categories });
    } catch (err) {
      return next(err);
    }
  }

  // POST
  async add(req, res, next) {
    const { name, code } = req.body;
    const { store } = req.query;

    try {
      const category = new Categories({
        name,
        code,
        store,
      });

      await category.save();

      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /:id
  async update(req, res, next) {
    const { name, code, availability, products: newProducts } = req.body;
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const category = await Categories.findOne({ _id, store });

      if (!category)
        return res.status(400).json({ error: 'Categoria não encontrada.' });

      if (name) category.name = name;
      if (code) category.code = code;
      if (availability !== undefined) category.availability = availability;
      if (newProducts) category.products = newProducts;

      const products = await Products.find({
        $or: [{ category: category._id }, { _id: { $in: newProducts } }],
      });

      const listProducts = [];

      products.forEach((product) => {
        if (newProducts.includes(String(product._id))) {
          product.category = _id;
        } else {
          product.category = null;
        }

        listProducts.push(product.save());
      });

      await Promise.all(listProducts);

      category.save();

      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const category = await Categories.findOne({ _id, store });

      if (!category)
        return res.status(400).json({ error: 'Categoria não encontrada.' });

      await category.remove();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }

  // PRODUCTS
  // GET /:id/produtos
  async showProducts(req, res, next) {
    const { offset, limit, store } = req.query;
    const { id: category } = req.params;

    try {
      const products = await Products.paginate(
        { store, category },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
        },
      );

      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /:id/produtos
  async updateListProducts(req, res, next) {
    const { productsList } = req.body;
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const category = await Categories.findOne({ _id, store });

      if (!category)
        return res.status(400).json({ error: 'Categoria não encontrada.' });

      category.products = productsList;

      const products = await Products.find({
        $or: [{ category: category._id }, { _id: { $in: productsList } }],
      });

      const listProducts = [];

      products.forEach((product) => {
        if (productsList.includes(String(product._id))) {
          product.category = _id;
        } else {
          product.category = null;
        }

        listProducts.push(product.save());
      });

      await Promise.all(listProducts);

      category.save();

      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  }
}

export default CategoriesController;

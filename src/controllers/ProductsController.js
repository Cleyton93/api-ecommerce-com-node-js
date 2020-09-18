import fs from 'fs';

import Products from '../models/Products.js';
import Categories from '../models/Categories.js';
import Variations from '../models/Variations.js';
import Ratings from '../models/Ratings.js';

function getSort(order) {
  switch (order) {
    case 'a-z':
      return { title: 1 };

    case 'z-a':
      return { title: -1 };

    case 'new':
      return { createdAt: -1 };

    case 'old':
      return { createdAt: 1 };

    case 'high-price':
      return { price: -1 };

    case 'low-price':
      return { price: 1 };

    default:
      return {};
  }
}

class ProductsController {
  // POST
  async add(req, res, next) {
    const { store } = req.query;
    const {
      title,
      description,
      category: categoryId,
      price,
      promotion,
      sku,
    } = req.body;

    try {
      const category = await Categories.findOne({ _id: categoryId, store });

      if (!category)
        return res.status(400).json({ error: 'Categoria não encontrada.' });

      const product = new Products({
        title,
        description,
        category: categoryId,
        price,
        promotion,
        sku,
        store,
      });

      await product.save();

      category.products.push(product._id);

      await category.save();

      return res.json({ product });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /:id
  async update(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;
    const {
      title,
      description,
      category: categoryId,
      price,
      promotion,
      sku,
      availability,
    } = req.body;

    try {
      const product = await Products.findOne({ _id, store });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      if (title) product.title = title;
      if (description) product.description = description;
      if (price) product.price = price;
      if (promotion) product.promotion = promotion;
      if (sku) product.sku = sku;
      if (typeof availability === 'boolean')
        product.availability = availability;

      const category = await Categories.findOne({ _id: categoryId, store });
      const oldCategoryId = product.category;

      if (category) {
        product.category = String(categoryId);
      }

      await product.save();

      if (category && String(categoryId) !== String(oldCategoryId)) {
        const oldCategory = await Categories.findById(oldCategoryId);
        oldCategory.products.splice(
          oldCategory.products.indexOf(String(product._id)),
          1,
        );

        category.products.push(String(product._id));

        await oldCategory.save();
        await category.save();
      } else if (
        category &&
        category.products.indexOf(String(product._id)) === -1
      ) {
        category.products.push(String(product._id));

        await category.save();
      }

      return res.json({ product });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /images/:id
  async uploadImages(req, res, next) {
    const { store } = req.query;
    const { id: _id } = req.params;
    const { files } = req;

    try {
      const product = await Products.findOne({ store, _id });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      const images = files.map((img) => img.filename);

      product.photos = product.photos.concat(images);

      await product.save();

      return res.json({ product });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const product = await Products.findOne({ store, _id });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      const variations = await Variations.find({
        _id: { $in: product.variations },
      });
      const category = await Categories.findOne({
        _id: product.category,
        store,
      });

      const ratings = await Ratings.find({ product: product._id });

      const variationsPromiseList = [];

      variations.forEach((variation) => {
        variationsPromiseList.push(variation.remove());
      });

      if (category) {
        category.products.splice(
          category.products.indexOf(String(product._id)),
          1,
        );
      }

      const ratingsList = [];

      ratings.forEach((rating) => {
        ratingsList.push(rating.remove());
      });

      await product.remove();

      await Promise.all(variationsPromiseList);

      await Promise.all(ratingsList);

      if (category) await category.save();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /image/:id
  async removeImage(req, res, next) {
    const { store } = req.query;
    const { id: _id } = req.params;
    const { image } = req.body;

    try {
      const product = await Products.findOne({ store, _id });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado' });

      if (!product.photos.includes(image))
        return res.status(400).json({ error: 'Imagem não encontrada.' });

      product.photos.splice(product.photos.indexOf(image), 1);

      return fs.stat(`./src/public/images/${image}`, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ error: 'Imagem não encontrada no servidor' });
        }

        return fs.unlink(`./src/public/images/${image}`, async (err) => {
          if (err) {
            return res
              .status(400)
              .json({ error: 'Erro inespardo, a imagem não foi deletada' });
          }

          await product.save();

          return res.json({ product });
        });
      });
    } catch (err) {
      return next(err);
    }
  }

  // CLIENTS
  // GET
  async getAll(req, res, next) {
    const { offset, limit, store, order } = req.query;

    try {
      const products = await Products.paginate(
        { store },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          sort: getSort(order),
          populate: 'category',
        },
      );

      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  }

  // GET /disponiveis
  async getAllAvailables(req, res, next) {
    const { offset, limit, store, order } = req.query;

    try {
      const products = await Products.paginate(
        { store, availability: true },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          sort: getSort(order),
          populate: 'category',
        },
      );

      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  }

  // GET /search/:search
  async search(req, res, next) {
    const { offset, limit, store, order } = req.query;
    const { search } = req.params;

    const regex = new RegExp(search, 'i');

    try {
      const products = await Products.paginate(
        { store, title: { $regex: regex } },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          sort: getSort(order),
          populate: 'category',
        },
      );

      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    const { id } = req.params;

    try {
      const product = await Products.findById(id).populate([
        'ratings',
        'variations',
        'store',
        'category',
      ]);

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado' });

      return res.json({ product });
    } catch (err) {
      return next(err);
    }
  }

  // VARIACOES
  // GET /:id/variacoes
  async getVariations(req, res, next) {
    const { id: product } = req.params;
    const { offset, limit } = req.query;

    try {
      const variations = await Variations.paginate(
        { product },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
        },
      );

      return res.json({ variations });
    } catch (err) {
      return next(err);
    }
  }

  // RATINGS
  // GET /:id/avaliacoes
  async getRatings(req, res, next) {
    const { id: product } = req.params;
    const { offset, limit } = req.query;

    try {
      const ratings = await Ratings.paginate(
        { product },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
        },
      );

      return res.json({ ratings });
    } catch (err) {
      return next(err);
    }
  }
}

export default ProductsController;

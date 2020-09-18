import fs from 'fs';

import Variations from '../models/Variations.js';
import Products from '../models/Products.js';

function handleDeleteImage(image, cb = null) {
  return fs.stat(`./src/public/images/${image}`, (err) => {
    if (err) {
      if (typeof cb === 'function') cb('Imagem não encontrada no servidor.');
      return null;
    }

    return fs.unlink(`./src/public/images/${image}`, (err) => {
      if (typeof cb !== 'function') return null;
      if (err) return cb('A imagem não foi encontrada no servidor.');

      return cb(false);
    });
  });
}

class VariationsController {
  // GET
  async getAll(req, res, next) {
    const { offset, limit, store, product } = req.query;

    try {
      const variations = await Variations.paginate(
        { store, product },
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

  // GET /:id
  async getById(req, res, next) {
    const { id } = req.params;

    try {
      const variation = await Variations.findById(id);

      if (!variation)
        return res.status(400).json({ error: 'Variação não encontrada.' });

      return res.json({ variation });
    } catch (err) {
      return next(err);
    }
  }

  // POST
  async add(req, res, next) {
    const { store, product: productId } = req.query;
    const { code, name, price, promotion, delivery, quantity } = req.body;

    try {
      const product = await Products.findOne({ _id: productId, store });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      const variation = new Variations({
        product: String(productId),
        store,
        code,
        name,
        price,
        promotion,
        delivery,
        quantity,
      });

      product.variations.push(String(variation._id));

      await variation.save();
      await product.save();

      return res.json({ variation });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id
  async update(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;
    const { code, name, price, promotion, delivery, quantity } = req.body;

    try {
      const variation = await Variations.findOne({ _id, store });

      if (code) variation.code = code;
      if (name) variation.name = name;
      if (price) variation.price = price;
      if (promotion) variation.promotion = promotion;
      if (delivery) variation.delivery = delivery;
      if (quantity) variation.quantity = quantity;

      await variation.save();

      return res.json({ variation });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /images/id
  async uploadImages(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;
    const { files } = req;

    try {
      const variation = await Variations.findOne({ _id, store });

      if (!variation) {
        files.forEach((img) => handleDeleteImage(img.filename));
        return res.status(400).json({ error: 'Variação não encontrada.' });
      }

      const images = files.map((img) => img.filename);

      variation.photos = variation.photos.concat(images);

      await variation.save();

      return res.json({ variation });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const variation = await Variations.findOne({ _id, store });

      if (!variation)
        return res.status(400).json({ error: 'Variação não encontrada.' });

      const product = await Products.findById(variation.product);

      if (product && product.variations.includes(String(_id))) {
        product.variations.splice(product.variations.indexOf(String(_id)), 1);

        await product.save();
      }

      variation.photos.forEach((img) => {
        handleDeleteImage(img);
      });

      await variation.remove();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /image/:id
  async removeImage(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;
    const { image } = req.body;

    try {
      const variation = await Variations.findOne({ _id, store });

      if (!variation)
        return res.status(400).json({ error: 'Variação não econtrada.' });

      if (!variation.photos.includes(String(image)))
        return res.status(400).json({ error: 'Imagem não encontrada.' });

      variation.photos.splice(variation.photos.indexOf(String(image)), 1);

      return handleDeleteImage(image, async (err) => {
        if (err) return res.status(400).json({ err });

        await variation.save();

        return res.json({ deleted: true });
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default VariationsController;

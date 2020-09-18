import Ratings from '../models/Ratings.js';
import Products from '../models/Products.js';
import Clients from '../models/Clients.js';

class RatingsController {
  // GET
  async getAll(req, res, next) {
    const { offset, limit, product } = req.query;

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

  // GET /:id
  async getById(req, res, next) {
    const { id } = req.params;

    try {
      const rating = await Ratings.findById(id).populate('product');

      if (!rating)
        return res.status(400).json({ error: 'Variação não encontrada.' });

      return res.json({ rating });
    } catch (err) {
      return next(err);
    }
  }

  // POST
  async add(req, res, next) {
    const { store, product: productId } = req.query;
    const { id: user } = req.payload;
    const { name, text, points } = req.body;

    try {
      const client = await Clients.findOne({ user, store });

      if (!client)
        return res.status(401).json({ error: 'Cliente não encontrado.' });

      const rating = new Ratings({
        store,
        product: productId,
        name,
        text,
        points,
        client: String(client._id),
      });

      const product = await Products.findOne({ store, _id: productId });

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      product.ratings.push(String(rating._id));

      await rating.save();
      await product.save();

      return res.json({ rating });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const rating = await Ratings.findOne({ store, _id });

      if (!rating)
        return res.status(400).json({ error: 'Avaliação não encontrada.' });

      const product = await Products.findById(rating.product);

      if (!product)
        return res.status(400).json({ error: 'Produto não encontrado.' });

      product.ratings.splice(product.ratings.indexOf(String(_id)), 1);

      await rating.remove();
      await product.save();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }
}

export default RatingsController;

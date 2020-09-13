import Stores from '../models/Stores.js';
import Users from '../models/Users.js';

class StoresController {
  // GET
  async getAll(req, res, next) {
    try {
      const stores = await Stores.find().select(
        '_id cnpj email phones address',
      );

      return res.json({ stores });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id
  async getById(req, res, next) {
    const { id } = req.params;

    try {
      const store = await Stores.findById(id).select(
        '_id name cpnj email phones address',
      );

      if (!store)
        return res.status(400).json({ error: 'Loja não encontrada.' });

      return res.json({ store });
    } catch (err) {
      return next(err);
    }
  }

  // POST
  async add(req, res, next) {
    const { name, cnpj, email, phones, address } = req.body;
    const { id } = req.payload;

    try {
      const user = await Users.findById(id);

      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado.' });

      const store = new Stores({ name, cnpj, email, phones, address });

      await store.save();

      return res.json({ store });
    } catch (err) {
      return next(err);
    }
  }

  // PUT
  async update(req, res, next) {
    const { name, cnpj, email, phones, address } = req.body;
    const { store: id } = req.query;

    try {
      const store = await Stores.findById(id);

      if (!store)
        return res.status(400).json({ error: 'Loja não encontrada.' });

      if (name) store.name = name;
      if (cnpj) store.cnpj = cnpj;
      if (email) store.email = email;
      if (phones) store.phones = phones;
      if (address) store.address = address;

      await store.save();

      return res.json({ store });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE
  async remove(req, res, next) {
    const { store: id } = req.query;

    try {
      const store = await Stores.findById(id);

      if (!store)
        return res.status(400).json({ error: 'Loja não encontrada.' });

      await store.remove();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }
}

export default StoresController;

import Clients from '../models/Clients.js';
import Users from '../models/Users.js';

class ClientsController {
  /* ROTAS ADMIN */
  // GET
  async getAll(req, res, next) {
    const { offset, limit, store } = req.query;

    try {
      const clients = await Clients.paginate(
        { store },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          populate: { path: 'user', select: '-hash -salt' },
        },
      );

      return res.json({ clients });
    } catch (err) {
      return next(err);
    }
  }

  // GET /search/:search/pedidos
  // async searchRequests(req, res, next) {}

  // GET /search/:search
  async search(req, res, next) {
    const { offset, limit, store } = req.query;
    const { search } = req.params;

    const regex = new RegExp(search, 'i');

    try {
      const clients = await Clients.paginate(
        { store, name: { $regex: regex } },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
          populate: { path: 'user', select: '-hash -salt' },
        },
      );

      return res.json({ clients });
    } catch (err) {
      return next(err);
    }
  }

  // GET /admin/:id/pedidos
  // async showClientRequests(req, res, next) {}

  // GET /admin/:id
  async getClientById(req, res, next) {
    const { id } = req.params;
    const { store } = req.query;

    try {
      const client = await Clients.findOne({ store, _id: id }).populate({
        path: 'user',
        select: '-hash -salt',
      });

      if (!client)
        return res.status(400).json({ error: 'Cliente não registrado' });

      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /admin/:id
  async updateAdmin(req, res, next) {
    const { name, cpf, email, address, phones, dateOfBirth, pass } = req.body;
    const { store } = req.query;
    const { id } = req.params;

    try {
      const client = await Clients.findOne({ store, _id: id, deleted: false });

      if (!client)
        return res
          .status(400)
          .json({ error: 'Cliente não registrado ou deletado' });

      const user = await Users.findById(client.user);

      if (name) {
        client.name = name;
        user.name = name;
      }
      if (cpf) client.cpf = cpf;
      if (email) user.email = email;
      if (address) client.address = address;
      if (phones) client.phones = phones;
      if (dateOfBirth) client.dateOfBirth = dateOfBirth;
      if (pass) await user.setPass(pass);

      await user.save();
      await client.save();

      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }

  /* ROUTES CLIENT */
  // GET /show
  async getClient(req, res, next) {
    const { store } = req.query;
    const { id: user } = req.payload;

    try {
      const client = await Clients.findOne({ store, user }).populate({
        path: 'user',
        select: '-hash -salt',
      });

      if (!client)
        return res.status(400).json({ error: 'Cliente não registrado' });

      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }

  // POST
  async add(req, res, next) {
    const { name, email, cpf, phones, address, dateOfBirth, pass } = req.body;
    const { store } = req.query;

    try {
      const user = new Users({ name, email, store });
      await user.setPass(pass);

      const client = new Clients({
        name,
        cpf,
        phones,
        address,
        dateOfBirth,
        store,
        user: user._id,
      });

      await user.save();
      await client.save();

      return res.json({
        client: { ...client._doc, email: user.email },
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUT
  async update(req, res, next) {
    const { name, email, cpf, phones, address, dateOfBirth, pass } = req.body;
    const { store } = req.query;
    const { id } = req.payload;

    try {
      const client = await Clients.findOne({ store, user: id, deleted: false });

      if (!client)
        return res
          .status(400)
          .json({ error: 'Cliente não registrado ou deletado' });

      const user = await Users.findById(client.user);

      if (name) {
        client.name = name;
        user.name = name;
      }
      if (cpf) client.cpf = cpf;
      if (email) user.email = email;
      if (address) client.address = address;
      if (phones) client.phones = phones;
      if (dateOfBirth) client.dateOfBirth = dateOfBirth;
      if (pass) await user.setPass(pass);

      await user.save();
      await client.save();

      return res.json({ client: { ...client._doc, email: user.email } });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE
  async remove(req, res, next) {
    const { store } = req.query;
    const { id: user } = req.payload;

    try {
      const client = await Clients.findOne({ store, user }).populate('user');

      if (!client)
        return res.status(400).json({ error: 'Cliente não registrado' });

      await client.user.remove();

      client.deleted = true;
      await client.save();

      return res.json({ deleted: true });
    } catch (err) {
      return next();
    }
  }
}

export default ClientsController;

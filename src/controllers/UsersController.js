import Users from '../models/Users.js';
import sendEmailRecovery from '../helpers/email-recovery.js';

class UsersController {
  // GET
  async getUser(req, res, next) {
    const { id } = req.payload;

    try {
      const user = await Users.findById(id);
      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado' });

      return res.json({ user: user.sendAuthJSON() });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id
  async getUserById(req, res, next) {
    const { id } = req.params;

    try {
      const user = await Users.findById(id);
      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado' });

      return res.json({
        user: {
          name: user.name,
          email: user.email,
          permissions: user.permissions,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // POST /register
  async register(req, res, next) {
    const { name, email, pass, store } = req.body;

    try {
      const user = new Users({ name, email, store });

      await user.setPass(pass);
      await user.save();

      return res.json({ user: user.sendAuthJSON() });
    } catch (err) {
      return next(err);
    }
  }

  // PUT
  async update(req, res, next) {
    const { id } = req.payload;
    const { name, email, pass } = req.body;

    try {
      const user = await Users.findById(id);
      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado' });

      if (name) user.name = name;
      if (email) user.email = email;
      if (pass) user.setPass(pass);

      await user.save();

      return res.json({ user: user.sendAuthJSON() });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE
  async remove(req, res, next) {
    const { id } = req.payload;

    try {
      const user = await Users.findById(id);

      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado' });

      await user.remove();

      return res.json({ deleted: true });
    } catch (err) {
      return next(err);
    }
  }

  // POST /login
  async login(req, res, next) {
    const { email, pass } = req.body;

    try {
      const user = await Users.findOne({ email });

      if (!user)
        return res.status(401).json({ error: 'Usuário não registrado.' });

      if (!(await user.passValidator(pass)))
        return res.status(401).json({ error: 'Senha inválida.' });

      return res.json({ user: user.sendAuthJSON() });
    } catch (err) {
      return next(err);
    }
  }

  // GET /recuperar-senha
  async showRecovery(req, res) {
    const data = { error: null, success: null };

    return res.render('recovery', data);
  }

  // POST /recuperar-senha
  async createRecovery(req, res, next) {
    const { email } = req.body;

    if (!email) {
      const data = {
        error: 'Preencha com o seu E-mail.',
        success: null,
      };

      return res.render('recovery', data);
    }

    try {
      const user = await Users.findOne({ email });

      if (!user) {
        const data = {
          error: 'Não existe usuário com esse email',
          success: null,
        };
        return res.render('recovery', data);
      }

      const recovery = await user.generateTokenForPasswordRecovery();

      await user.save();

      const response = (error = null, success = null) => {
        return res.render('recovery', { error, success });
      };

      return sendEmailRecovery({ user, token: recovery.token }, response);
    } catch (err) {
      return next(err);
    }
  }

  // GET /senha-recuperada
  async showCompleteRecovery(req, res, next) {
    const { token } = req.query;

    if (!token) {
      const data = {
        error: 'Token não identificado.',
        success: null,
      };

      return res.render('recovery', data);
    }

    try {
      const user = await Users.findOne({ 'recovery.token': token });

      if (!user) {
        const data = {
          error: 'Não existe um usuário com esse token.',
          success: null,
        };

        return res.render('recovery', data);
      }

      if (new Date(user.recovery.date) < new Date()) {
        const data = {
          error: 'Token expirado, tente novamente.',
          success: null,
        };

        return res.render('recovery', data);
      }

      const data = {
        error: null,
        success: null,
        token: user.recovery.token,
      };

      return res.render('recovery/create-new-password', data);
    } catch (err) {
      return next(err);
    }
  }

  // POST /senha-recuperada
  async completeRecovery(req, res, next) {
    const { token, pass } = req.body;

    if (!token || !pass) {
      const data = {
        error: 'Preencha novamente com sua nova senha.',
        sucess: null,
        token,
      };

      return res.render('recovery/create-new-password', data);
    }

    try {
      const user = await Users.findOne({ 'recovery.token': token });

      if (!user) {
        const data = {
          error: 'Usuário não identificado.',
          success: null,
          token: null,
        };

        return res.render('recovery/create-new-password', data);
      }

      await user.finalizeTheToken();
      await user.setPass(pass);

      await user.save();

      const data = {
        error: null,
        success: 'Senha alterada com sucesso!',
        token: null,
      };

      return res.render('recovery/create-new-password', data);
    } catch (err) {
      return next(err);
    }
  }
}

export default UsersController;

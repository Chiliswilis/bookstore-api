const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Crea un error con código HTTP para que el middleware de errores lo use
const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

class AuthService {
  static async registerUser(userData) {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw createError('Name, email and password are required', 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError('El correo electrónico ya está registrado', 400);
    }

    // El rol NO se toma del body: todo registro público es CLIENT.
    // Los administradores se crean desde el seeder.
    const newUser = await User.create({ name, email, password, role: 'CLIENT' });

    const { password: _omit, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  static async loginUser(email, password) {
    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) throw createError('Credenciales inválidas', 401);

    const isMatch = await user.validPassword(password);
    if (!isMatch) throw createError('Credenciales inválidas', 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }
}

module.exports = AuthService;
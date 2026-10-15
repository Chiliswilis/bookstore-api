const AuthService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const user = await AuthService.registerUser(req.body);
    console.log(`[INFO] User ${user.email} registered successfully`);
    res.status(201).json({ message: 'User registered successfully', data: user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    console.log(`[INFO] User ${result.user.email} logged in successfully`);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    next(error);
  }
};
const sequelize = require('../config/database');
const User = require('./user.model');
const Book = require('./book.model');
const Category = require('./category.model');

// Asociaciones 1:N (una categoría tiene muchos libros)
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  sequelize,
  User,
  Book,
  Category,
};
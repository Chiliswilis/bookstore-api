const { Book, Category } = require('../models');
const { Op } = require('sequelize');

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

class BookService {
  // Listado con paginación, búsqueda y filtro por precio
  static async getAllBooks(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { search, minPrice, maxPrice } = query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },  // iLike: sin distinguir mayúsculas
        { author: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books: rows,
    };
  }

  static async getBookById(id) {
    const book = await Book.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!book) throw createError('Book not found', 404);
    return book;
  }

  static async createBook(bookData) {
    return await Book.create(bookData);
  }

  static async updateBook(id, bookData) {
    const book = await this.getBookById(id);
    return await book.update(bookData);
  }

  static async deleteBook(id) {
    const book = await this.getBookById(id);
    await book.destroy();
    return { message: 'Book deleted successfully', book };
  }
}

module.exports = BookService;
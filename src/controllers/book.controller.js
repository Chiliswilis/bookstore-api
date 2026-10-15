const BookService = require('../services/book.service');

exports.getBooks = async (req, res, next) => {
  try {
    const result = await BookService.getAllBooks(req.query);
    console.log('[INFO] Books retrieved successfully');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await BookService.getBookById(req.params.id);
    console.log(`[INFO] Book with ID ${req.params.id} retrieved successfully`);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const newBook = await BookService.createBook(req.body);
    console.log('[INFO] Book created successfully');
    res.status(201).json({ message: 'Book created successfully', data: newBook });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const updatedBook = await BookService.updateBook(req.params.id, req.body);
    console.log(`[INFO] Book with ID ${req.params.id} updated successfully`);
    res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const response = await BookService.deleteBook(req.params.id);
    console.log(`[INFO] Book with ID ${req.params.id} deleted successfully`);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
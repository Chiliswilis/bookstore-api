require('dotenv').config();
const { sequelize, User, Book, Category } = require('../models');

async function seed() {
  try {
    // Crea las tablas si no existen (NO borra datos)
    await sequelize.sync({ force: false });

    // 1. Usuarios (la contraseña se encripta con el hook beforeCreate)
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@bookstore.com' },
      defaults: {
        name: 'Administrador Principal',
        password: 'AdminPassword123!',
        role: 'ADMIN',
      },
    });

    const [client] = await User.findOrCreate({
      where: { email: 'estudiante@isc.edu.mx' },
      defaults: {
        name: 'Estudiante ISC',
        password: 'ClientePassword123!',
        role: 'CLIENT',
      },
    });

    // 2. Categoría
    const [category] = await Category.findOrCreate({
      where: { name: 'Programación' },
    });

    // 3. Libros de prueba asociados a la categoría
    const books = [
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        price: 45.99,
        stock: 10,
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma et al.',
        isbn: '978-0201633610',
        price: 54.5,
        stock: 5,
      },
    ];

    for (const book of books) {
      await Book.findOrCreate({
        where: { isbn: book.isbn },
        defaults: { ...book, categoryId: category.id },
      });
    }

    console.log('✓ Seeder ejecutado correctamente');
    console.log(`➜ Admin:   ${admin.email} / AdminPassword123!`);
    console.log(`➜ Cliente: ${client.email} / ClientePassword123!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar el seeder:', error);
    process.exit(1);
  }
}

seed();
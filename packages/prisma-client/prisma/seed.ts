const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Categories
  const categories = [
    { name: 'Fiksi Sastra & Klasik', description: 'Novel, sastra klasik, dan karya fiksi' },
    { name: 'Filsafat & Pemikiran', description: 'Buku filsafat, pemikiran, dan humaniora' },
    { name: 'Sains & Kosmologi', description: 'Ilmu pengetahuan alam, fisika, biologi, kosmologi' },
    { name: 'Sejarah & Dokumenter', description: 'Sejarah dunia, Indonesia, dan buku dokumenter' },
    { name: 'Teknologi & AI', description: 'Komputer, pemrograman, AI, dan teknologi' },
    { name: 'Pengembangan Diri', description: 'Motivasi, produktivitas, psikologi, dan kehidupan' },
    { name: 'Bisnis & Ekonomi', description: 'Manajemen, keuangan, kewirausahaan, ekonomi' },
    { name: 'Agama & Spiritualitas', description: 'Buku keagamaan, spiritual, dan tasawuf' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('130207', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@perpus.co.id' },
    update: {},
    create: {
      name: 'Admin PERPUS',
      email: 'admin@perpus.co.id',
      password: await bcrypt.hash('130207', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user seeded:', admin.email);

  // Seed Demo Member
  const member = await prisma.user.upsert({
    where: { email: 'member@perpus.co.id' },
    update: {},
    create: {
      name: 'Demo Member',
      email: 'member@perpus.co.id',
      password: await bcrypt.hash('password123', 10),
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Demo member seeded:', member.email);

  // Seed Sample Books
  const fictiionCat = await prisma.category.findUnique({ where: { name: 'Fiksi Sastra & Klasik' } });
  const philosophyCat = await prisma.category.findUnique({ where: { name: 'Filsafat & Pemikiran' } });
  const scienceCat = await prisma.category.findUnique({ where: { name: 'Sains & Kosmologi' } });
  const historyCat = await prisma.category.findUnique({ where: { name: 'Sejarah & Dokumenter' } });
  const techCat = await prisma.category.findUnique({ where: { name: 'Teknologi & AI' } });

  const sampleBooks = [
    {
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      publisher: 'Hasta Mitra',
      categoryId: fictiionCat?.id,
      isbn: '9789799731236',
      year: 1980,
      description: 'Klasik sastra Indonesia yang menceritakan perjuangan Minke di masa kolonial.',
      coverImage: 'https://books.google.com/books/content?id=...&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      totalStock: 5,
      availableStock: 5,
      shelfLocation: 'A-01-01',
    },
    {
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      publisher: 'Bentang Pustaka',
      categoryId: fictiionCat?.id,
      isbn: '9789793062792',
      year: 2005,
      description: 'Kisah inspiratif anak-anak Belitung yang berjuang untuk pendidikan.',
      coverImage: 'https://books.google.com/books/content?id=...&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      totalStock: 3,
      availableStock: 3,
      shelfLocation: 'A-01-02',
    },
    {
      title: 'Filosofi Teras',
      author: 'Henry Manampiring',
      publisher: 'Kompas',
      categoryId: philosophyCat?.id,
      isbn: '9786024123456',
      year: 2018,
      description: 'Panduan praktis filsafat Stoa untuk kehidupan modern.',
      coverImage: 'https://books.google.com/books/content?id=...&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      totalStock: 4,
      availableStock: 4,
      shelfLocation: 'B-02-01',
    },
    {
      title: 'Sapiens: Riwayat Singkat Umat Manusia',
      author: 'Yuval Noah Harari',
      publisher: 'Kepustakaan Populer Gramedia',
      categoryId: historyCat?.id,
      isbn: '9786024246872',
      year: 2015,
      description: 'Sejarah umat manusia dari masa praaksara hingga era digital.',
      coverImage: 'https://books.google.com/books/content?id=...&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      totalStock: 2,
      availableStock: 2,
      shelfLocation: 'C-03-01',
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publisher: 'Pearson',
      categoryId: techCat?.id,
      isbn: '9780132350884',
      year: 2008,
      description: 'Panduan menulis kode yang bersih, readable, dan maintainable.',
      coverImage: 'https://books.google.com/books/content?id=...&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      totalStock: 3,
      availableStock: 3,
      shelfLocation: 'D-04-01',
    },
  ];

  for (const book of sampleBooks) {
    if (book.categoryId) {
      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {},
        create: book,
      });
    }
  }
  console.log('✅ Sample books seeded');

  console.log('🎉 Seeding completed successfully!');
}

const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
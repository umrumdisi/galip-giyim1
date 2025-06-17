const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Veritabanı seed işlemi başlıyor...')

  // Kategorileri ekle
  const CATEGORIES = [
    { name: 'Pantolon' },
    { name: 'Tişört' },
    { name: 'Gömlek' },
    { name: 'Ceket' },
    { name: 'Mont' },
    { name: 'Şort' },
    { name: 'Şapka' },
    { name: 'Ayakkabı' }
  ]
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name }
    })
  }
  console.log('Kategoriler başarıyla eklendi')

  // Kategorilerden birinin id'sini al
  const firstCategory = await prisma.category.findFirst()
  const categoryId = firstCategory ? firstCategory.id : null

  // Kullanıcı ekle
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'USER',
      isAdmin: false
    }
  })
  console.log('Kullanıcı başarıyla eklendi')

  // Admin kullanıcı ekle
  const adminPassword = await bcrypt.hash('admin123456', 10);
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isAdmin: true
    }
  });
  console.log('Admin kullanıcı başarıyla eklendi');

  // Ürün ekle
  if (categoryId) {
    await prisma.product.create({
      data: {
        name: 'Örnek Ürün',
        description: 'Bu bir örnek üründür.',
        price: 199.99,
        stock: 20,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: categoryId
      }
    })
    console.log('Ürün başarıyla eklendi')
  }

  // Cart ekle
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id
    }
  })
  console.log('Cart başarıyla eklendi')

  // CartItem ekle
  const product = await prisma.product.findFirst()
  if (cart && product) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      update: {},
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: 2
      }
    })
    console.log('CartItem başarıyla eklendi')
  }

  // Order ekle
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'PENDING',
      totalAmount: 399.98
    }
  })
  console.log('Order başarıyla eklendi')

  // OrderItem ekle
  if (order && product) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 2,
        price: 199.99
      }
    })
    console.log('OrderItem başarıyla eklendi')
  }

  // Setting ekle
  const existingSetting = await prisma.setting.findFirst();
  if (existingSetting) {
    await prisma.setting.update({
      where: { id: existingSetting.id },
      data: { aboutText: 'Galip Giyim hakkında örnek metin.' }
    });
  } else {
    await prisma.setting.create({
      data: { aboutText: 'Galip Giyim hakkında örnek metin.' }
    });
  }
  console.log('Setting başarıyla eklendi')

  // Message ekle
  await prisma.message.create({
    data: {
      userId: user.id,
      title: 'Hoşgeldiniz',
      content: 'Sitemize hoşgeldiniz!',
      createdAt: new Date()
    }
  })
  console.log('Message başarıyla eklendi')
}

main()
  .catch((e) => {
    console.error('Seed işlemi sırasında hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
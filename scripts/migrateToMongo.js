const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('Veri migrasyonu başlıyor...');

    // Kullanıcıları taşı
    console.log('Kullanıcılar taşınıyor...');
    const users = await prisma.user.findMany();
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }
    console.log(`${users.length} kullanıcı taşındı`);

    // Kategorileri taşı
    console.log('Kategoriler taşınıyor...');
    const categories = await prisma.category.findMany();
    for (const category of categories) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      });
    }
    console.log(`${categories.length} kategori taşındı`);

    // Ürünleri taşı
    console.log('Ürünler taşınıyor...');
    const products = await prisma.product.findMany();
    for (const product of products) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    }
    console.log(`${products.length} ürün taşındı`);

    // Sepetleri taşı
    console.log('Sepetler taşınıyor...');
    const carts = await prisma.cart.findMany();
    for (const cart of carts) {
      await prisma.cart.create({
        data: {
          id: cart.id,
          userId: cart.userId,
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt
        }
      });
    }
    console.log(`${carts.length} sepet taşındı`);

    // Sepet öğelerini taşı
    console.log('Sepet öğeleri taşınıyor...');
    const cartItems = await prisma.cartItem.findMany();
    for (const item of cartItems) {
      await prisma.cartItem.create({
        data: {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      });
    }
    console.log(`${cartItems.length} sepet öğesi taşındı`);

    // Siparişleri taşı
    console.log('Siparişler taşınıyor...');
    const orders = await prisma.order.findMany();
    for (const order of orders) {
      await prisma.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }
      });
    }
    console.log(`${orders.length} sipariş taşındı`);

    // Sipariş öğelerini taşı
    console.log('Sipariş öğeleri taşınıyor...');
    const orderItems = await prisma.orderItem.findMany();
    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      });
    }
    console.log(`${orderItems.length} sipariş öğesi taşındı`);

    // Ayarları taşı
    console.log('Ayarlar taşınıyor...');
    const settings = await prisma.setting.findMany();
    for (const setting of settings) {
      await prisma.setting.create({
        data: {
          id: setting.id,
          aboutText: setting.aboutText,
          createdAt: setting.createdAt,
          updatedAt: setting.updatedAt
        }
      });
    }
    console.log(`${settings.length} ayar taşındı`);

    // Mesajları taşı
    console.log('Mesajlar taşınıyor...');
    const messages = await prisma.message.findMany();
    for (const message of messages) {
      await prisma.message.create({
        data: {
          id: message.id,
          userId: message.userId,
          title: message.title,
          content: message.content,
          createdAt: message.createdAt,
          adminReply: message.adminReply,
          repliedAt: message.repliedAt
        }
      });
    }
    console.log(`${messages.length} mesaj taşındı`);

    console.log('Veri migrasyonu başarıyla tamamlandı!');
  } catch (error) {
    console.error('Migrasyon sırasında hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData(); 
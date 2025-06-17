const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function hashAdminPassword() {
  try {
    // Admin kullanıcısını bul
    const adminUser = await prisma.user.findFirst({
      where: {
        isAdmin: true
      }
    });

    if (!adminUser) {
      console.log('Admin kullanıcısı bulunamadı!');
      return;
    }

    console.log('Mevcut admin kullanıcısı:', {
      id: adminUser.id,
      email: adminUser.email,
      password: adminUser.password,
      isAdmin: adminUser.isAdmin
    });

    // Şifre zaten hash'li mi kontrol et
    if (adminUser.password.startsWith('$2b$') || adminUser.password.startsWith('$2a$')) {
      console.log('Şifre zaten hash\'li!');
      return;
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    
    // Veritabanını güncelle
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    });

    console.log('Admin şifresi başarıyla hash\'lendi!');
    console.log('Yeni hash:', hashedPassword);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

hashAdminPassword(); 
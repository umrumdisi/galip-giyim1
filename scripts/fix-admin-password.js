const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminPassword() {
  try {
    const adminEmail = 'admin@admin.com';
    const newPassword = '123456';

    console.log('=== ADMIN ŞİFRE DÜZELTME ===');
    console.log('Email:', adminEmail);
    console.log('Yeni şifre:', newPassword);

    // Admin kullanıcısını bul
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true }
    });

    if (!adminUser) {
      console.log('❌ Admin kullanıcısı bulunamadı!');
      return;
    }

    console.log('✅ Admin kullanıcısı bulundu:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isAdmin: adminUser.isAdmin
    });

    // Yeni şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('Yeni hash:', hashedPassword);

    // Veritabanını güncelle
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin şifresi güncellendi!');

    // Test et
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('Test karşılaştırması:', isValid);

    if (isValid) {
      console.log('✅ Şifre doğru çalışıyor!');
    } else {
      console.log('❌ Şifre hala çalışmıyor!');
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword(); 
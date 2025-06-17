const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const testEmail = 'admin@admin.com';
    const testPassword = '123456';

    console.log('=== GİRİŞ TESTİ ===');
    console.log('Email:', testEmail);
    console.log('Şifre:', testPassword);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı!');
      return;
    }

    console.log('✅ Kullanıcı bulundu:', {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      passwordLength: user.password.length,
      passwordStart: user.password.substring(0, 20) + '...'
    });

    // Şifre hash'li mi kontrol et
    const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
    console.log('Şifre hash\'li mi:', isHashed);

    if (isHashed) {
      // Hash'li şifre ile karşılaştır
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Hash karşılaştırması:', isValid);
      
      if (isValid) {
        console.log('✅ Giriş başarılı!');
      } else {
        console.log('❌ Şifre yanlış!');
      }
    } else {
      // Düz metin karşılaştırma
      const isValid = user.password === testPassword;
      console.log('Düz metin karşılaştırması:', isValid);
      
      if (isValid) {
        console.log('✅ Giriş başarılı!');
      } else {
        console.log('❌ Şifre yanlış!');
        console.log('Veritabanındaki şifre:', user.password);
      }
    }

  } catch (error) {
    console.error('Test hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 
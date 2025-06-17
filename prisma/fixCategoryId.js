const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    // Eğer categoryId number ise, string'e çevir
    if (typeof product.categoryId === 'number') {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: String(product.categoryId) }
      });
      console.log(`Düzeltildi: ${product.name} (${product.id})`);
    }
  }
  console.log('Tüm ürünlerin categoryId alanı string olarak güncellendi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
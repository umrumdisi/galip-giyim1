import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const body = await request.json();
    const { items, address, fullName } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş.' }, { status: 400 });
    }
    if (!address || !fullName) {
      return NextResponse.json({ error: 'Adres ve isim zorunlu.' }, { status: 400 });
    }

    // Kullanıcıyı bul veya anonim müşteri olarak kaydet
    let user = null;
    if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }
    if (!user) {
      return NextResponse.json({ error: 'Sipariş oluşturmak için giriş yapmalısınız.' }, { status: 401 });
    }

    // Sipariş toplamını hesapla
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Transaction başlat
    const result = await prisma.$transaction(async (tx) => {
      // Stok kontrolü ve güncelleme
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) {
          throw new Error('Ürün bulunamadı: ' + item.id);
        }
        if (product.stock < item.quantity) {
          throw new Error(`'${product.name}' ürünü için yeterli stok yok.`);
        }
        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity }
        });
      }
      // Siparişi oluştur
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });
      return order;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    console.error('Sipariş oluşturulamadı:', error);
    return NextResponse.json({ error: error.message || 'Sipariş oluşturulamadı.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');
  if (!orderId) {
    return NextResponse.json({ error: 'Sipariş ID gerekli.' }, { status: 400 });
  }
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, description: true, price: true } }
          }
        }
      }
    });
    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Sipariş detayı alınamadı.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Sipariş ID ve yeni durum gerekli.' }, { status: 400 });
    }
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Sipariş durumu güncellenemedi.' }, { status: 500 });
  }
} 
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

    // Sipariş toplamını hesapla
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: user ? user.id : undefined,
        customerName: fullName,
        address,
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

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Sipariş oluşturulamadı:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
  }
} 
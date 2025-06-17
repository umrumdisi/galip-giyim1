import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

// Sepetten ürün sil
export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    })

    if (!user?.cart) {
      return NextResponse.json({ error: 'Sepet bulunamadı' }, { status: 404 })
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cartId: user.cart.id
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Ürün sepette bulunamadı' }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    })

    return NextResponse.json({ message: 'Ürün sepetten silindi' })
  } catch (error) {
    return NextResponse.json({ error: 'Ürün sepetten silinemedi' }, { status: 500 })
  }
} 
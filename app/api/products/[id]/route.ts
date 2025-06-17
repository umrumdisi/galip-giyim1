import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { uploadImage } from '@/app/lib/uploadImage'

// Tekil ürün getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Ürün getirilemedi' }, { status: 500 })
  }
}

// Ürün güncelle (sadece admin)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let name: string = ''
  let categoryId: string = ''
  
  try {
    console.log('PUT isteği başladı, ürün ID:', params.id)
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('Oturum bulunamadı')
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })

    if (!admin?.isAdmin) {
      console.log('Admin yetkisi yok:', session.user.email)
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    console.log('Form verisi alınıyor...')
    const formData = await request.formData()
    
    // Form verilerini kontrol et ve logla
    const formEntries = Array.from(formData.entries())
    console.log('Form verileri:', formEntries.map(([key, value]) => {
      if (value instanceof File) {
        return [key, `File: ${value.name} (${value.size} bytes)`]
      }
      return [key, value]
    }))

    name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const stock = formData.get('stock') as string
    categoryId = formData.get('categoryId') as string
    const image = formData.get('image') as File | null

    // Gerekli alanları kontrol et
    if (!name || !description || !price || !stock || !categoryId) {
      console.log('Eksik alanlar:', { name, description, price, stock, categoryId })
      return NextResponse.json({ error: 'Tüm gerekli alanları doldurun' }, { status: 400 })
    }

    // Sayısal değerleri kontrol et
    const numericPrice = parseFloat(price)
    const numericStock = parseInt(stock)

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Geçerli bir fiyat girin' }, { status: 400 })
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json({ error: 'Geçerli bir stok miktarı girin' }, { status: 400 })
    }

    // Kategori kontrolü
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      console.log('Kategori bulunamadı:', categoryId)
      return NextResponse.json({ error: 'Seçilen kategori bulunamadı' }, { status: 400 })
    }

    let imageUrl: string | undefined

    if (image && image.size > 0) {
      console.log('Görsel yükleniyor...')
      try {
        imageUrl = await uploadImage(image)
        console.log('Görsel yüklendi:', imageUrl)
      } catch (uploadError) {
        console.error('Görsel yükleme hatası:', uploadError)
        return NextResponse.json({ error: 'Görsel yüklenemedi' }, { status: 500 })
      }
    }

    console.log('Ürün güncelleniyor...', {
      id: params.id,
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      categoryId,
      imageUrl: imageUrl || 'mevcut görsel korunacak'
    })

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        categoryId,
        ...(imageUrl && { imageUrl })
      },
      include: {
        category: true
      }
    })
    
    console.log('Ürün başarıyla güncellendi:', product.id)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error)
    
    // Prisma hatalarını daha detaylı logla
    if (error instanceof Error) {
      console.error('Hata mesajı:', error.message)
      console.error('Hata stack:', error.stack)
      
      // Prisma hatalarını özel olarak yakala
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({ 
          error: 'Güncellenecek ürün bulunamadı',
          details: 'Ürün ID: ' + params.id
        }, { status: 404 })
      }
      
      if (error.message.includes('Foreign key constraint failed')) {
        return NextResponse.json({ 
          error: 'Seçilen kategori geçerli değil',
          details: 'Kategori ID: ' + categoryId
        }, { status: 400 })
      }
      
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json({ 
          error: 'Bu ürün adı zaten kullanılıyor',
          details: 'Ürün adı: ' + name
        }, { status: 400 })
      }
    }
    
    // Genel hata mesajı
    return NextResponse.json({ 
      error: 'Ürün güncellenemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Ürün sil (sadece admin)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE isteği başladı, ürün ID:', params.id)
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('Oturum bulunamadı')
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })

    if (!admin?.isAdmin) {
      console.log('Admin yetkisi yok:', session.user.email)
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    // Önce ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      console.log('Ürün bulunamadı:', params.id)
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    console.log('Ürün bulundu, referanslar kontrol ediliyor...')

    // CartItem'larda referansları sil
    const cartItemsCount = await prisma.cartItem.count({
      where: { productId: params.id }
    })
    
    if (cartItemsCount > 0) {
      console.log(`${cartItemsCount} adet CartItem siliniyor...`)
      await prisma.cartItem.deleteMany({
        where: { productId: params.id }
      })
    }

    // OrderItem'larda referansları sil
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: params.id }
    })
    
    if (orderItemsCount > 0) {
      console.log(`${orderItemsCount} adet OrderItem siliniyor...`)
      await prisma.orderItem.deleteMany({
        where: { productId: params.id }
      })
    }

    // Şimdi ürünü sil
    console.log('Ürün siliniyor...')
    await prisma.product.delete({
      where: { id: params.id }
    })
    
    console.log('Ürün başarıyla silindi')
    return NextResponse.json({ 
      message: 'Ürün başarıyla silindi',
      deletedCartItems: cartItemsCount,
      deletedOrderItems: orderItemsCount
    })
  } catch (error) {
    console.error('Ürün silinirken hata:', error)
    
    // Prisma hatalarını daha detaylı logla
    if (error instanceof Error) {
      console.error('Hata mesajı:', error.message)
      console.error('Hata stack:', error.stack)
    }
    
    return NextResponse.json({ 
      error: 'Ürün silinemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
} 
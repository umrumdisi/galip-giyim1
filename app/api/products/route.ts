import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { Prisma } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Tüm ürünleri getir
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // categoryId'yi string olarak döndür
    const fixedProducts = products.map((product) => ({
      ...product,
      categoryId: String(product.categoryId)
    }));

    return NextResponse.json(fixedProducts)
  } catch (error) {
    console.error('Ürünler getirilemedi:', error)
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı başlatılamadı', details: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Ürünler getirilemedi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Yeni ürün ekle (sadece admin)
export async function POST(request: Request) {
  try {
    console.log('POST isteği başladı')
    const session = await getServerSession(authOptions)
    console.log('Oturum durumu:', session)

    if (!session?.user?.email) {
      console.log('Oturum bulunamadı')
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true, role: true }
    })
    console.log('Kullanıcı bilgileri:', admin)

    if (!admin?.isAdmin && admin?.role !== 'ADMIN') {
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

    const image = formData.get('image') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const stock = formData.get('stock') as string
    const categoryId = formData.get('categoryId') as string

    // Tüm alanların varlığını kontrol et
    const requiredFields = { image, name, description, price, stock, categoryId }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      console.log('Eksik alanlar:', missingFields)
      return NextResponse.json(
        { error: `Şu alanlar eksik: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Sayısal değerleri kontrol et
    const numericPrice = parseFloat(price)
    const numericStock = parseInt(stock)
    // categoryId artık string olarak kullanılacak

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: 'Geçerli bir fiyat girmelisiniz' },
        { status: 400 }
      )
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json(
        { error: 'Geçerli bir stok miktarı girmelisiniz' },
        { status: 400 }
      )
    }

    // Kategori kontrolü
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      console.log('Kategori bulunamadı:', categoryId)
      return NextResponse.json(
        { error: 'Seçilen kategori bulunamadı' },
        { status: 400 }
      )
    }

    let filePath: string | undefined;
    // Görsel işleme
    try {
      console.log('Görsel işleniyor...')
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      console.log('Görsel boyutu:', buffer.length, 'bytes')

      if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json(
          { error: 'Görsel boyutu 5MB\'dan büyük olamaz' },
          { status: 400 }
        )
      }

      // uploads klasörünü kontrol et
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadDir)) {
        console.log('Uploads klasörü oluşturuluyor...')
        mkdirSync(uploadDir, { recursive: true })
      }

      // Dosya adı ve uzantı işlemleri
      let fileExtension = image.name.split('.').pop()?.toLowerCase() || 'jpg'
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension)) {
        fileExtension = 'jpg'
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
      filePath = join(uploadDir, fileName)
      
      console.log('Dosya kaydediliyor:', filePath)
      await writeFile(filePath, buffer)
      console.log('Dosya başarıyla kaydedildi')

      // Veritabanına kaydet
      console.log('Veritabanına kaydediliyor...', {
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        imageUrl: `/uploads/${fileName}`,
        categoryId: categoryId
      })

      let product;
      try {
        product = await prisma.product.create({
          data: {
            name,
            description,
            price: numericPrice,
            stock: numericStock,
            imageUrl: `/uploads/${fileName}`,
            categoryId: categoryId
          },
          include: {
            category: true
          }
        })

        console.log('Ürün başarıyla oluşturuldu:', product)
        return NextResponse.json(product)
      } catch (error) {
        // Prisma hatalarını yakala
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error('Prisma bilinen hata:', {
            code: error.code,
            message: error.message,
            meta: error.meta
          })
          
          // Foreign key hatası
          if (error.code === 'P2003') {
            return NextResponse.json(
              { error: 'Seçilen kategori geçerli değil' },
              { status: 400 }
            )
          }
        }
        
        if (error instanceof Prisma.PrismaClientValidationError) {
          console.error('Prisma doğrulama hatası:', error.message)
          return NextResponse.json(
            { error: 'Ürün bilgileri geçerli değil' },
            { status: 400 }
          )
        }

        throw error // Diğer hataları üst catch bloğuna gönder
      }
    } catch (error) {
      console.error('Dosya işleme veya veritabanı hatası:', error)
      
      // Dosya yüklendiyse ve veritabanı hatası olduysa dosyayı sil
      if (filePath) {
        try {
          const fs = require('fs')
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log('Yüklenen dosya silindi:', filePath)
          }
        } catch (unlinkError) {
          console.error('Dosya silinirken hata:', unlinkError)
        }
      }

      return NextResponse.json(
        { 
          error: 'Ürün eklenirken bir hata oluştu',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Genel hata:', error)
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst();
    return NextResponse.json({ aboutText: setting?.aboutText || '' });
  } catch (error) {
    return NextResponse.json({ aboutText: '' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { aboutContent } = await req.json();
    const setting = await prisma.setting.upsert({
      where: { id: "1" },
      update: { aboutText: aboutContent },
      create: { id: "1", aboutText: aboutContent },
    });
    return NextResponse.json({ aboutContent: setting.aboutText });
  } catch (error) {
    console.error('About ayarı güncellenirken hata:', error);
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { aboutText } = await request.json();
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: { aboutText } });
    } else {
      setting = await prisma.setting.update({ where: { id: setting.id }, data: { aboutText } });
    }
    return NextResponse.json({ aboutText: setting.aboutText });
  } catch (error) {
    console.error('About ayarı güncellenirken hata:', error);
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
} 
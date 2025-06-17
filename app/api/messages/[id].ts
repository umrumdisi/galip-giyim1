import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const { adminReply } = await request.json();
  const updated = await prisma.message.update({
    where: { id: params.id },
    data: { adminReply, repliedAt: new Date() },
  });
  return NextResponse.json(updated);
} 
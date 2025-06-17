import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Email veya şifre eksik');
          throw new Error('Email ve şifre gerekli');
        }

        try {
          console.log('Kullanıcı aranıyor:', credentials.email);
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.log('Kullanıcı bulunamadı:', credentials.email);
            throw new Error('Kullanıcı bulunamadı');
          }

          console.log('Kullanıcı bulundu:', {
            id: user.id,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            passwordLength: user.password.length,
            passwordStartsWith: user.password.substring(0, 10) + '...'
          });

          // Şifre hash'li mi kontrol et
          if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
            console.log('Şifre hash\'li değil, düz metin olarak karşılaştırılıyor');
            if (user.password === credentials.password) {
              console.log('Düz metin şifre eşleşti');
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isAdmin: user.isAdmin
              };
            } else {
              console.log('Düz metin şifre eşleşmedi');
              throw new Error('Geçersiz şifre');
            }
          }

          console.log('Hash\'li şifre karşılaştırılıyor...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('Şifre kontrolü sonucu:', {
            isValid: isPasswordValid,
            providedPassword: credentials.password,
            hashedPasswordStart: user.password.substring(0, 20) + '...'
          });

          if (!isPasswordValid) {
            console.log('Hash\'li şifre eşleşmedi');
            throw new Error('Geçersiz şifre');
          }

          console.log('Giriş başarılı!');
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.isAdmin
          };
        } catch (error) {
          console.error('Giriş hatası:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user:', user);
        return {
          ...token,
          id: user.id,
          role: user.role || 'USER',
          isAdmin: user.isAdmin || false
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          isAdmin: token.isAdmin
        }
      };
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true, // Debug'ı açık tutuyoruz
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  session: {
    strategy: 'jwt',
  },
}; 
'use client'

import { SessionProvider as Provider } from 'next-auth/react'

export default function SessionProvider({ children, session }: any) {
  return <Provider session={session}>{children}</Provider>
} 
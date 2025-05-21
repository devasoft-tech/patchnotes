"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={undefined}
      themes={['light', 'dark', 'system']}
      value={{
        light: 'light',
        dark: 'dark',
        system: 'system'
      }}
    >
      {children}
    </NextThemesProvider>
  )
} 
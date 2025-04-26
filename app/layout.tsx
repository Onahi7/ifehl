import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CMDA Nigeria - IFEHL 2025",
  description: "Join us for a transformative experience of practical management and learning for Christian doctors - IFEHL 2025, June 7-14th in Calabar",
  generator: 'v0.dev',
  openGraph: {
    title: "CMDA Nigeria - IFEHL 2025 (02)",
    description: "Join us for a transformative experience of practical management and learning for Christian doctors - IFEHL 2025, June 7-14th in Calabar",
    images: [
      {
        url: "https://res.cloudinary.com/da5amwknx/image/upload/v1745685247/Blue_and_Yellow_Modern_Corporate_Logowqweewerwerew_vjhx6s.png",
        width: 1200,
        height: 630,
        alt: "IFEHL 2025 Banner"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CMDA Nigeria - IFEHL 2025 (02)",
    description: "Join us for a transformative experience of practical management and learning for Christian doctors - IFEHL 2025, June 7-14th in Calabar",
    images: ["https://res.cloudinary.com/da5amwknx/image/upload/v1745685247/Blue_and_Yellow_Modern_Corporate_Logowqweewerwerew_vjhx6s.png"],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

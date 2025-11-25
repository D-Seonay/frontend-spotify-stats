"use client"

import type React from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

type Props = {
  children: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

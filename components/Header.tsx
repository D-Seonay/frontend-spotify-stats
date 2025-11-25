// components/Header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"

type Props = {
  onLogin?: () => void
}

export default function Header({ onLogin }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
            <span className="font-mono text-lg font-bold text-black">SLS</span>
          </div>
          <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Product Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-sm text-gray-300 transition-colors hover:text-white"
              onMouseEnter={() => setProductDropdownOpen(true)}
              onMouseLeave={() => setProductDropdownOpen(false)}
            >
              Produit
              <ChevronDown className="h-4 w-4" />
            </button>
            {productDropdownOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-black/95 p-2 backdrop-blur-xl"
                onMouseEnter={() => setProductDropdownOpen(true)}
                onMouseLeave={() => setProductDropdownOpen(false)}
              >
                <Link
                  href="/features"
                  className="block rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-[#1DB954]"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="block rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-[#1DB954]"
                >
                  Tarifs
                </Link>
                <Link
                  href="/faq"
                  className="block rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-[#1DB954]"
                >
                  FAQ
                </Link>
              </div>
            )}
          </div>

          <Link href="/about" className="text-sm text-gray-300 transition-colors hover:text-white">
            À propos
          </Link>
          <Link href="/blog" className="text-sm text-gray-300 transition-colors hover:text-white">
            Blog
          </Link>
          <Link href="/careers" className="text-sm text-gray-300 transition-colors hover:text-white">
            Carrières
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button
            className="rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105"
            onClick={handleLogin}
          >
            Se connecter avec Spotify
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/features"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/faq"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/blog"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/careers"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Carrières
            </Link>
            <Button
              className="w-full rounded-full bg-[#1DB954] text-black font-semibold transition-all hover:bg-[#1ed760]"
              onClick={handleLogin}
            >
              Se connecter avec Spotify
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

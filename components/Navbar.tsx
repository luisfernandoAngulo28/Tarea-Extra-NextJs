import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-bold text-gray-900">
            NextShop
          </Link>
        </div>
        <div className="flex item-center gap-6 text-gray-600 font-medium">
          <Link
            href="/"
            className="rounded-md px-2 py-1 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className="rounded-md px-2 py-1 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Productos
          </Link>
          <Link
            href="/about"
            className="rounded-md px-2 py-1 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Acerca de
          </Link>
        </div>
      </div>
    </nav>
  );
}

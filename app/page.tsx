"use client";

import Banner from "@/components/Banner";
import CartBubble from "@/components/CartBubble";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import { UseGetProduct } from "./products/hooks/useGetProduct";

function CategoriesSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mx-auto mb-10 h-8 w-72 animate-pulse rounded bg-slate-100" />
      <div className="flex justify-center gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`category-skeleton-${index}`} className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-full bg-slate-100 md:h-20 md:w-20" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { products, loading, error } = UseGetProduct();

  const categories = [...new Set(products.map((product) => product.category))];
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Banner />

      {loading ? (
        <CategoriesSkeleton />
      ) : error ? (
        <section className="mx-auto max-w-7xl px-6 py-14 text-center text-red-500">
          Error al cargar las categorias
        </section>
      ) : (
        <CategoriesSection categories={categories} />
      )}

      <FeaturedProductsSection
        products={featuredProducts}
        loading={loading}
        error={error}
      />

      <CartBubble />
    </div>
  );
}

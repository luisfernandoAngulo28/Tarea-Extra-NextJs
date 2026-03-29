import Link from "next/link";
import Image from "next/image";
import { GetProductResponse } from "@/app/products/interfaces/getproduct.interface";

type FeaturedProductsSectionProps = {
  products: GetProductResponse[];
  loading: boolean;
  error: Error | null;
};

function FeaturedCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
      <div className="h-40 rounded-lg bg-slate-100" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 h-8 w-1/3 rounded bg-slate-100" />
    </div>
  );
}

export default function FeaturedProductsSection({
  products,
  loading,
  error,
}: FeaturedProductsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Productos destacados
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Una seleccion curada para que encuentres algo increible mas rapido.
          </p>
        </div>
        <Link
          href="/products"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Ver todo
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <FeaturedCardSkeleton key={`featured-skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No pudimos cargar los productos destacados. Intenta recargar la pagina.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-44 items-center justify-center bg-slate-50 p-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={220}
                  height={220}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="p-4">
                <p className="mb-2 line-clamp-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                  {product.category}
                </p>
                <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 min-h-[3.75rem]">
                  {product.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">${product.price}</span>
                  <span className="text-sm font-medium text-amber-500">
                    {product.rating.rate} ★
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

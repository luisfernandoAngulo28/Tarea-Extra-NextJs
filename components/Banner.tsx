import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="bg-linear-to-r from-blue-600 to-indigo-500 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:py-20">
        <div className="max-w-2xl">
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Compra mejor, paga menos
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            Productos verificados, envio rapido y precios competitivos en un solo lugar.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-lg bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Ver productos
            </Link>
            <Link
              href="/products?sort=rating-desc"
              className="rounded-lg border border-white/50 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Ver ofertas
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md md:max-w-lg">
          <Image
            src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
            alt="Mochila destacada"
            width={500}
            height={300}
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 500px"
            className="h-auto w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

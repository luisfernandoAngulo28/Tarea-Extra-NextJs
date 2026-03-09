"use client";
import ProductCard from "@/components/ProductCard";
import { UseGetProduct } from "./hooks/useGetProduct";

function ProductPage() {
  const { products, loading, error } = UseGetProduct();

  return (
    <div className="bg-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-black">Productos</h1>
      <div className="flex flex-wrap gap-6">
        {loading ? (
          <p className="text-black">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">Error al cargar los productos</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              price={product.price}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductPage;

"use client";
import ProductCard from "@/components/ProductCard";
import { UseGetProduct } from "./hooks/useGetProduct";
import { useState } from "react";
import ProductDetailModal from "./components/ProductDetailModal";
import { Pencil, Trash2 } from "lucide-react";
import ProductFormModal from "./components/ProductFormModal";
import DeleteProductModal from "./components/DeleteProductModal";
import CategoryFilter from "./components/CategoryFilter";

function ProductPage() {
  const { products, loading, error, refetch } = UseGetProduct();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="bg-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-black">Productos</h1>

      <ProductFormModal
        trigger={
          <button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded">
            Agregar Producto
          </button>
        }
        onSuccess={refetch} // Refrescamos la lista de productos después de agregar uno nuevo
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-black">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">Error al cargar los productos</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              price={product.price}
              rating={product.rating.rate}
              category={product.category}
              actions={
                <>
                  <ProductFormModal
                    product={product}
                    trigger={
                      <button className="text-blue-600 flex items-center gap-1 text-sm">
                        <Pencil size={16} />
                      </button>
                    }
                    onSuccess={refetch} // Refrescamos la lista de productos después de editar uno
                  />

                  <DeleteProductModal
                    productId={product.id}
                    onDelete={(id) => console.log("delete", id)}
                    trigger={
                      <button className="text-red-600 flex items-center gap-1 text-sm">
                        <Trash2 size={16} />
                      </button>
                    }
                    onSuccess={refetch} // Refrescamos la lista de productos después de eliminar uno
                  />
                </>
              }
              detailTrigger={
                <ProductDetailModal
                  product={product}
                  trigger={
                    <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
                      Ver detalles
                    </button>
                  }
                />
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductPage;

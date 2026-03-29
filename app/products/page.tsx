"use client";

import ProductCard from "@/components/ProductCard";
import { UseGetProduct } from "./hooks/useGetProduct";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductDetailModal from "./components/ProductDetailModal";
import { Pencil, Trash2, X } from "lucide-react";
import ProductFormModal from "./components/ProductFormModal";
import DeleteProductModal from "./components/DeleteProductModal";
import CategoryFilter from "./components/CategoryFilter";
import ProductEditModal from "./components/ProductEditModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GetProductResponse } from "./interfaces/getproduct.interface";
import { PostProductResponse } from "./interfaces/postproduct.interface";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevancia",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "rating-desc": "Mejor valorados",
  "name-asc": "Nombre: A-Z",
};

const PAGE_SIZE = 8;

function isSortOption(value: string | null): value is SortOption {
  if (!value) {
    return false;
  }

  return Object.keys(SORT_LABELS).includes(value);
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-52 bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/5 rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-100" />
        <div className="mt-6 flex items-center justify-between">
          <div className="h-5 w-1/4 rounded bg-slate-100" />
          <div className="h-4 w-1/5 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  selectedCategory: string;
  searchTerm: string;
  onResetFilters: () => void;
};

function ProductsEmptyState({
  selectedCategory,
  searchTerm,
  onResetFilters,
}: EmptyStateProps) {
  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasCategoryFilter = selectedCategory !== "all";

  return (
    <div className="col-span-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center md:col-span-3 lg:col-span-4">
      <h3 className="text-lg font-semibold text-slate-900">No encontramos productos</h3>
      <p className="mt-2 text-sm text-slate-600">
        {hasActiveSearch
          ? `No hay resultados para \"${searchTerm}\"${
              hasCategoryFilter ? ` en la categoria \"${selectedCategory}\"` : ""
            }.`
          : selectedCategory === "all"
            ? "Todavia no hay productos para mostrar."
            : `No hay productos en la categoria \"${selectedCategory}\".`}
      </p>
      {(hasCategoryFilter || hasActiveSearch) && (
        <button
          onClick={onResetFilters}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

type FilterChipsProps = {
  searchTerm: string;
  selectedCategory: string;
  sortOption: SortOption;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearSort: () => void;
  onClearAll: () => void;
};

function FilterChips({
  searchTerm,
  selectedCategory,
  sortOption,
  onClearSearch,
  onClearCategory,
  onClearSort,
  onClearAll,
}: FilterChipsProps) {
  const hasAnyFilter =
    searchTerm.trim().length > 0 || selectedCategory !== "all" || sortOption !== "relevance";

  if (!hasAnyFilter) {
    return null;
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600">Filtros activos:</span>

      {searchTerm.trim().length > 0 && (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Busqueda: {searchTerm}
          <X size={14} />
        </button>
      )}

      {selectedCategory !== "all" && (
        <button
          onClick={onClearCategory}
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Categoria: {selectedCategory}
          <X size={14} />
        </button>
      )}

      {sortOption !== "relevance" && (
        <button
          onClick={onClearSort}
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          Orden: {SORT_LABELS[sortOption]}
          <X size={14} />
        </button>
      )}

      <button
        onClick={onClearAll}
        className="ml-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        Limpiar todo
      </button>
    </div>
  );
}

function sortProducts(products: GetProductResponse[], sortOption: SortOption) {
  const clonedProducts = [...products];

  switch (sortOption) {
    case "price-asc":
      return clonedProducts.sort((a, b) => a.price - b.price);
    case "price-desc":
      return clonedProducts.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return clonedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    case "name-asc":
      return clonedProducts.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return clonedProducts;
  }
}

function normalizeCreatedProduct(product: PostProductResponse): GetProductResponse {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category as GetProductResponse["category"],
    image: product.image,
    price: product.price,
    rating: {
      rate: product.rating?.rate ?? 0,
      count: product.rating?.count ?? 0,
    },
  };
}

function ProductPageContent() {
  const { products, loading, error, refetch } = UseGetProduct();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    searchParams.get("q") || "",
  );
  const initialSortParam = searchParams.get("sort");
  const [sortOption, setSortOption] = useState<SortOption>(
    isSortOption(initialSortParam) ? initialSortParam : "relevance",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [createdProducts, setCreatedProducts] = useState<GetProductResponse[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, GetProductResponse>>(
    {},
  );

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    const urlSearchTerm = searchParams.get("q") || "";
    const urlSort = searchParams.get("sort");

    setSelectedCategory(urlCategory);
    setSearchTerm(urlSearchTerm);
    setDebouncedSearchTerm(urlSearchTerm);
    setSortOption(isSortOption(urlSort) ? urlSort : "relevance");
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();

    const trimmedSearch = debouncedSearchTerm.trim();
    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (sortOption !== "relevance") {
      params.set("sort", sortOption);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [debouncedSearchTerm, pathname, router, selectedCategory, sortOption]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, debouncedSearchTerm, sortOption]);

  const allProducts = useMemo(() => {
    const productsWithLocalEdits = products.map(
      (product) => editedProducts[product.id] ?? product,
    );

    const productIds = new Set(productsWithLocalEdits.map((product) => product.id));
    const uniqueCreatedProducts = createdProducts
      .map((createdProduct) => editedProducts[createdProduct.id] ?? createdProduct)
      .filter((createdProduct) => !productIds.has(createdProduct.id));

    return [...uniqueCreatedProducts, ...productsWithLocalEdits];
  }, [createdProducts, editedProducts, products]);

  const categories = useMemo(
    () => ["all", ...new Set(allProducts.map((product) => product.category))],
    [allProducts],
  );

  const normalizedSearchTerm = debouncedSearchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    const categoryFilteredProducts =
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((product) => product.category === selectedCategory);

    if (!normalizedSearchTerm) {
      return categoryFilteredProducts;
    }

    return categoryFilteredProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(normalizedSearchTerm);
      const descriptionMatch = product.description
        .toLowerCase()
        .includes(normalizedSearchTerm);
      const categoryMatch = product.category
        .toLowerCase()
        .includes(normalizedSearchTerm);

      return titleMatch || descriptionMatch || categoryMatch;
    });
  }, [allProducts, normalizedSearchTerm, selectedCategory]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortOption),
    [filteredProducts, sortOption],
  );

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < sortedProducts.length;

  return (
    <div className="bg-white p-10">
      <h1 className="mb-8 text-3xl font-bold text-black">Productos</h1>

      <ProductFormModal
        trigger={
          <button className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
            Agregar producto
          </button>
        }
        onCreated={(created) => {
          const normalizedProduct = normalizeCreatedProduct(created);
          const apiIds = new Set(products.map((product) => product.id));

          setCreatedProducts((prevProducts) => {
            let nextId = normalizedProduct.id;
            if (!Number.isFinite(nextId) || nextId <= 0) {
              nextId = Date.now();
            }

            while (
              apiIds.has(nextId) ||
              prevProducts.some((existingProduct) => existingProduct.id === nextId)
            ) {
              nextId += 1;
            }

            const productWithSafeId = { ...normalizedProduct, id: nextId };
            return [productWithSafeId, ...prevProducts];
          });
        }}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por titulo, descripcion o categoria..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-24 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Limpiar
            </button>
          )}
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
          aria-label="Ordenar productos"
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="rating-desc">Mejor valorados</option>
          <option value="name-asc">Nombre: A-Z</option>
        </select>

        <p className="text-sm text-slate-600">
          {loading ? "Cargando..." : `${sortedProducts.length} resultado(s)`}
        </p>
      </div>

      <FilterChips
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        onClearSearch={() => setSearchTerm("")}
        onClearCategory={() => setSelectedCategory("all")}
        onClearSort={() => setSortOption("relevance")}
        onClearAll={() => {
          setSearchTerm("");
          setSelectedCategory("all");
          setSortOption("relevance");
        }}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">No se pudieron cargar los productos.</p>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : error ? (
          <ProductsEmptyState
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onResetFilters={() => {
              setSelectedCategory("all");
              setSearchTerm("");
              setSortOption("relevance");
            }}
          />
        ) : sortedProducts.length === 0 ? (
          <ProductsEmptyState
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onResetFilters={() => {
              setSelectedCategory("all");
              setSearchTerm("");
              setSortOption("relevance");
            }}
          />
        ) : (
          visibleProducts.map((product) => (
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
                  <ProductEditModal
                    product={product}
                    trigger={
                      <button className="flex items-center gap-1 text-sm text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                        <Pencil size={16} />
                      </button>
                    }
                    onUpdated={(updatedProduct) => {
                      setEditedProducts((prevProducts) => ({
                        ...prevProducts,
                        [updatedProduct.id]: updatedProduct,
                      }));

                      setCreatedProducts((prevProducts) =>
                        prevProducts.map((createdProduct) =>
                          createdProduct.id === updatedProduct.id
                            ? updatedProduct
                            : createdProduct,
                        ),
                      );
                    }}
                    onSuccess={refetch}
                  />

                  <DeleteProductModal
                    productId={product.id}
                    onDelete={(id) => {
                      setCreatedProducts((prevProducts) =>
                        prevProducts.filter((createdProduct) => createdProduct.id !== id),
                      );

                      setEditedProducts((prevProducts) => {
                        const nextProducts = { ...prevProducts };
                        delete nextProducts[id];
                        return nextProducts;
                      });
                    }}
                    trigger={
                      <button className="flex items-center gap-1 text-sm text-red-600 transition hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
                        <Trash2 size={16} />
                      </button>
                    }
                    onSuccess={refetch}
                  />
                </>
              }
              detailTrigger={
                <ProductDetailModal
                  product={product}
                  trigger={
                    <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
                      Ver detalles
                    </button>
                  }
                />
              }
            />
          ))
        )}
      </div>

      {!loading && !error && hasMoreProducts && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Cargar mas
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="bg-white p-10 text-slate-700">Cargando filtros...</div>}>
      <ProductPageContent />
    </Suspense>
  );
}

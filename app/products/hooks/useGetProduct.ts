"use client";

import { useEffect, useState } from "react";
import { GetProductResponse } from "../interfaces/getproduct.interface";
import { getProducts } from "../services/getproduct.service";

export function UseGetProduct() {
  const [products, setProducts] = useState<GetProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Estado para manejar errores

  // Función para cargar los productos desde la API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false); // Aseguramos que el estado de carga se actualice al finalizar la petición
    }
  };

  useEffect(() => {
    fetchProducts(); // Cargamos los productos al montar el componente
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts, // Función para recargar los productos desde la API
  };
}

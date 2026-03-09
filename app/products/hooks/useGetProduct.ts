"use client";

import { useEffect, useState } from "react";
import { GetProductResponse } from "../interfaces/getproduct.interface";
import { getProducts } from "../services/getproduct.service";

export function UseGetProduct() {
  const [products, setProducts] = useState<GetProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return {
    products,
    loading,
    error,
  };
}

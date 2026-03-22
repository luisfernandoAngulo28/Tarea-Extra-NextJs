"use client";

import { useState } from "react";
import {
  PostProductRequest,
  PostProductResponse,
} from "../interfaces/postproduct.interface";
import { postProduct } from "../services/getproduct.service";

export function usePostProduct() {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    data: PostProductRequest,
  ): Promise<PostProductResponse> => {
    setloading(true);
    setError(null);

    try {
      const createdProduct = await postProduct(data);
      return createdProduct;
    } catch (err) {
      setError("No se pudo crear el producto");
      throw err;
    } finally {
      setloading(false);
    }
  };
  return {
    createProduct,
    loading,
    error,
  };
}

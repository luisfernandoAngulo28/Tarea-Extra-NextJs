"use client";

import { useState } from "react";
import {
  UpdateProductRequest,
  UpdateProductResponse,
} from "../interfaces/postproduct.interface";
import { updateProduct } from "../services/getproduct.service";

export function useUpdateProduct() {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProduct = async (
    id: number,
    data: UpdateProductRequest,
  ): Promise<UpdateProductResponse> => {
    setloading(true);
    setError(null);

    try {
      const updatedProduct = await updateProduct(id, data);
      return updatedProduct;
    } catch (err) {
      setError("No se pudo actualizar el producto");
      throw err;
    } finally {
      setloading(false);
    }
  };

  return {
    editProduct,
    loading,
    error,
  };
}

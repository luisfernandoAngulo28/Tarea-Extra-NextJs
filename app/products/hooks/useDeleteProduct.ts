import { useState } from "react";
import { DeleteProductResponse } from "../interfaces/postproduct.interface";
import { deleteProduct } from "../services/getproduct.service";

export function useDeleteProduct() {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeProduct = async (id: number): Promise<DeleteProductResponse> => {
    setloading(true);
    setError(null);
    try {
      const deletedProduct = await deleteProduct(id);
      return deletedProduct;
    } catch (err) {
      setError("No se pudo eliminar el producto");
      throw err;
    } finally {
      setloading(false);
    }
  };

  return {
    removeProduct,
    loading,
    error,
  };
}

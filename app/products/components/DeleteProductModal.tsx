"use client";

import Dialog from "@/components/Dialog";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { usePostProduct } from "../hooks/usePostProduct";
import { PostProductRequest } from "../interfaces/postproduct.interface";

type Props = {
  trigger: React.ReactNode;
  productId: number;
  onDelete: (id: number) => void;
  onSuccess?: () => void; //para refrescar la lista de productos después de eliminar
};

export default function DeleteProductModal({
  trigger,
  productId,
  onDelete,
  onSuccess,
}: Props) {
  const { removeProduct, loading, error } = useDeleteProduct();
  const { createProduct } = usePostProduct();
  const [isOpen, setIsOpen] = useState(false); // Control local del estado del modal
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUndoDelete = async (deletedProduct: PostProductRequest) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    try {
      const restorePromise = createProduct(deletedProduct);
      toast.promise(restorePromise, {
        loading: "Restaurando producto...",
        success: "Producto restaurado",
        error: "No se pudo restaurar el producto",
      });

      await restorePromise;
      onSuccess?.();
    } catch {
      // El toast de error ya es manejado por toast.promise.
    }
  };

  const handleDelete = async () => {
    try {
      const deletePromise = removeProduct(productId);
      toast.promise(deletePromise, {
        loading: "Eliminando producto...",
        success: "Producto eliminado",
        error: "Error al eliminar el producto",
      });

      const deletedProduct = await deletePromise;
      setIsOpen(false); // Cerramos el modal después de eliminar
      onDelete(productId);

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        onSuccess?.();
        refreshTimeoutRef.current = null;
      }, 5000);

      toast("Puedes deshacer esta accion", {
        duration: 5000,
        action: {
          label: "Deshacer",
          onClick: () =>
            handleUndoDelete({
              title: deletedProduct.title,
              price: deletedProduct.price,
              description: deletedProduct.description,
              category: deletedProduct.category,
              image: deletedProduct.image,
              rating: deletedProduct.rating,
            }),
        },
      });
    } catch {
      // El toast de error ya es manejado por toast.promise.
    }
  };

  return (
    <Dialog
      trigger={trigger}
      title="Eliminar producto"
      description="¿Estás seguro de que deseas eliminar este producto?"
      size="sm"
      open={isOpen} // Controlamos la apertura del modal con el estado local
      onOpenChange={setIsOpen} // Actualizamos el estado local cuando el modal se abra o cierre
      footer={
        <>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </>
      }
    >
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <p className="text-gray-600">Esta acción no se puede deshacer.</p>
    </Dialog>
  );
}

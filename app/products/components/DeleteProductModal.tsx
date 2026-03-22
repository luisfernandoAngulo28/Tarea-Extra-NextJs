"use client";

import Dialog from "@/components/Dialog";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false); // Control local del estado del modal

  const handleDelete = async () => {
    try {
      await removeProduct(productId);
      setIsOpen(false); // Cerramos el modal después de eliminar
      onDelete(productId);
      onSuccess?.(); // Llamamos a onSuccess para refrescar la lista de productos
      alert("Producto eliminado exitosamente");
    } catch {
      alert("Error al eliminar el producto");
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
          <button className="px-4 py-2 border rounded">Cancelar</button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
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

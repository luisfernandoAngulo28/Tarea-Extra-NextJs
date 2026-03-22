"use client";

import Dialog from "@/components/Dialog";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PostProductRequest } from "../interfaces/postproduct.interface";
import { usePostProduct } from "../hooks/usePostProduct";

type Props = {
  trigger: React.ReactNode;
  product?: PostProductRequest;
  onSuccess?: () => void; //para refrescar la lista de productos después de crear o editar
};

export default function ProductFormModal({
  trigger,
  product,
  onSuccess,
}: Props) {
  const { createProduct, loading, error } = usePostProduct();
  const [isOpen, setIsOpen] = useState(false); // Control local del estado del modal
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [category, setCategory] = useState(product?.category ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [rate, setRate] = useState(product?.rating?.rate ?? 0);
  const [count, setCount] = useState(product?.rating?.count ?? 0);

  const handleSubmit = async () => {
    const payload: PostProductRequest = {
      title,
      description,
      price,
      category,
      image,
      rating: {
        rate,
        count,
      },
    };

    try {
      await createProduct(payload);
      alert("Producto creado exitosamente");
      setIsOpen(false); // Cerramos el modal después de crear el producto
      onSuccess?.(); // Llamamos a onSuccess para refrescar la lista de productos
    } catch {
      alert("Error al crear el producto");
    }
  };

  const inputStyle =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <Dialog
      trigger={trigger}
      title={product ? "Editar producto" : "Crear producto"}
      description="Completa la información del producto."
      size="md"
      open={isOpen} // Controlamos la apertura del modal con el estado local
      onOpenChange={setIsOpen} // Actualizamos el estado local cuando el modal se abra o cierre
      footer={
        <div className="flex gap-3 justify-end">
          <DialogPrimitive.Close asChild>
            <button className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">
              Cancelar
            </button>
          </DialogPrimitive.Close>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {error && (
          <p className="text-red-500 col-span-1 md:col-span-2 text-sm">
            {error}
          </p>
        )}
        {/* TITLE */}
        <div className="col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Título</label>
          <input
            className={inputStyle}
            placeholder="Ej: Camiseta premium"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            className={inputStyle + " resize-none"}
            rows={3}
            placeholder="Describe el producto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            className={inputStyle}
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm font-medium text-gray-700">Categoría</label>
          <input
            className={inputStyle}
            placeholder="Ej: ropa"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* IMAGE */}
        <div className="col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            URL de imagen
          </label>
          <input
            className={inputStyle}
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        {/* RATING */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Rating (rate)
          </label>
          <input
            type="number"
            step="0.1"
            className={inputStyle}
            placeholder="4.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Cantidad de reviews
          </label>
          <input
            type="number"
            className={inputStyle}
            placeholder="120"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>
    </Dialog>
  );
}

"use client";

import Dialog from "@/components/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useProductForm } from "../hooks/useProductForm";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { GetProductResponse } from "../interfaces/getproduct.interface";
import { UpdateProductRequest } from "../interfaces/postproduct.interface";

type Props = {
  trigger: React.ReactNode;
  product: GetProductResponse;
  onSuccess?: () => void;
  onUpdated?: (product: GetProductResponse) => void;
};

export default function ProductEditModal({
  trigger,
  product,
  onSuccess,
  onUpdated,
}: Props) {
  const { editProduct, loading, error } = useUpdateProduct();
  const [isOpen, setIsOpen] = useState(false);
  const formId = useId();

  const {
    payload,
    errors,
    isFormValid,
    resetForm,
    setFieldValue,
    validateField,
    validateForm,
  } = useProductForm(product);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const patchPayload: UpdateProductRequest = {};

    if (payload.title !== product.title) {
      patchPayload.title = payload.title;
    }
    if (payload.description !== product.description) {
      patchPayload.description = payload.description;
    }
    if (payload.price !== product.price) {
      patchPayload.price = payload.price;
    }
    if (payload.category !== product.category) {
      patchPayload.category = payload.category;
    }
    if (payload.image !== product.image) {
      patchPayload.image = payload.image;
    }

    const ratingChanged =
      payload.rating.rate !== product.rating.rate ||
      payload.rating.count !== product.rating.count;

    if (ratingChanged) {
      patchPayload.rating = {};

      if (payload.rating.rate !== product.rating.rate) {
        patchPayload.rating.rate = payload.rating.rate;
      }
      if (payload.rating.count !== product.rating.count) {
        patchPayload.rating.count = payload.rating.count;
      }
    }

    if (Object.keys(patchPayload).length === 0) {
      toast.info("No hay cambios para actualizar");
      return;
    }

    try {
      const updatePromise = editProduct(product.id, patchPayload);
      toast.promise(updatePromise, {
        loading: "Actualizando producto...",
        success: "Producto actualizado exitosamente",
        error: "Error al actualizar el producto",
      });

      await updatePromise;

      const updatedProduct: GetProductResponse = {
        ...product,
        ...patchPayload,
        category: (patchPayload.category ?? product.category) as GetProductResponse["category"],
        rating: {
          rate: patchPayload.rating?.rate ?? product.rating.rate,
          count: patchPayload.rating?.count ?? product.rating.count,
        },
      };

      onUpdated?.(updatedProduct);
      setIsOpen(false);
      onSuccess?.();
    } catch {
      // El toast de error ya es manejado por toast.promise.
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100";
  const errorInputStyle =
    "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-100";

  const parseLocaleNumber = (value: string) =>
    Number(value.replace(",", "."));

  return (
    <Dialog
      trigger={trigger}
      title="Editar producto"
      description="Actualiza la ficha comercial del producto sin perder calidad de datos."
      size="lg"
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetForm();
        }
      }}
      footer={
        <div className="flex justify-end gap-3">
          <DialogPrimitive.Close asChild>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
              Cancelar
            </button>
          </DialogPrimitive.Close>

          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      }
    >
      {!isFormValid && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 md:col-span-2">
          Completa los campos obligatorios. Tip: en precio y rating puedes usar punto o coma decimal (ej: 2.1 o 2,1).
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {error && <p className="col-span-1 text-sm text-red-600 md:col-span-2">{error}</p>}

        <div className="col-span-1 md:col-span-2">
          <label htmlFor={`${formId}-title`} className="text-sm font-medium text-slate-700">
            Titulo *
          </label>
          <input
            id={`${formId}-title`}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${formId}-title-error` : undefined}
            className={`${inputStyle} ${errors.title ? errorInputStyle : ""}`}
            placeholder="Ej: Camiseta premium"
            value={payload.title}
            onChange={(e) => {
              setFieldValue("title", e.target.value);
              validateField("title", e.target.value);
            }}
          />
          {errors.title && (
            <p id={`${formId}-title-error`} className="mt-1 text-xs text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor={`${formId}-description`}
            className="text-sm font-medium text-slate-700"
          >
            Descripcion *
          </label>
          <textarea
            id={`${formId}-description`}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? `${formId}-description-error` : undefined}
            className={`${inputStyle} resize-none ${errors.description ? errorInputStyle : ""}`}
            rows={3}
            placeholder="Describe beneficios y detalles clave del producto"
            value={payload.description}
            onChange={(e) => {
              setFieldValue("description", e.target.value);
              validateField("description", e.target.value);
            }}
          />
          {errors.description && (
            <p id={`${formId}-description-error`} className="mt-1 text-xs text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-price`} className="text-sm font-medium text-slate-700">
            Precio *
          </label>
          <input
            id={`${formId}-price`}
            type="number"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? `${formId}-price-error` : undefined}
            className={`${inputStyle} ${errors.price ? errorInputStyle : ""}`}
            placeholder="0.00"
            value={payload.price}
            onChange={(e) => {
              const newValue = parseLocaleNumber(e.target.value);
              setFieldValue("price", newValue);
              validateField("price", newValue);
            }}
          />
          {errors.price && (
            <p id={`${formId}-price-error`} className="mt-1 text-xs text-red-600">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-category`} className="text-sm font-medium text-slate-700">
            Categoria *
          </label>
          <input
            id={`${formId}-category`}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? `${formId}-category-error` : undefined}
            className={`${inputStyle} ${errors.category ? errorInputStyle : ""}`}
            placeholder="Ej: electronics"
            value={payload.category}
            onChange={(e) => {
              setFieldValue("category", e.target.value);
              validateField("category", e.target.value);
            }}
          />
          {errors.category && (
            <p id={`${formId}-category-error`} className="mt-1 text-xs text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label htmlFor={`${formId}-image`} className="text-sm font-medium text-slate-700">
            URL de imagen *
          </label>
          <input
            id={`${formId}-image`}
            aria-invalid={Boolean(errors.image)}
            aria-describedby={errors.image ? `${formId}-image-error` : undefined}
            className={`${inputStyle} ${errors.image ? errorInputStyle : ""}`}
            placeholder="https://..."
            value={payload.image}
            onChange={(e) => {
              setFieldValue("image", e.target.value);
              validateField("image", e.target.value);
            }}
          />
          {errors.image && (
            <p id={`${formId}-image-error`} className="mt-1 text-xs text-red-600">
              {errors.image}
            </p>
          )}

          {payload.image && !errors.image && (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src={payload.image}
                alt="Vista previa de imagen"
                width={640}
                height={200}
                sizes="(max-width: 768px) 100vw, 640px"
                className="h-32 w-full object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-rate`} className="text-sm font-medium text-slate-700">
            Rating (rate) *
          </label>
          <input
            id={`${formId}-rate`}
            type="number"
            step="0.1"
            aria-invalid={Boolean(errors.rate)}
            aria-describedby={errors.rate ? `${formId}-rate-error` : undefined}
            className={`${inputStyle} ${errors.rate ? errorInputStyle : ""}`}
            placeholder="4.5"
            value={payload.rating.rate}
            onChange={(e) => {
              const newValue = parseLocaleNumber(e.target.value);
              setFieldValue("rate", newValue);
              validateField("rate", newValue);
            }}
          />
          {errors.rate && (
            <p id={`${formId}-rate-error`} className="mt-1 text-xs text-red-600">
              {errors.rate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-count`} className="text-sm font-medium text-slate-700">
            Cantidad de reviews *
          </label>
          <input
            id={`${formId}-count`}
            type="number"
            aria-invalid={Boolean(errors.count)}
            aria-describedby={errors.count ? `${formId}-count-error` : undefined}
            className={`${inputStyle} ${errors.count ? errorInputStyle : ""}`}
            placeholder="120"
            value={payload.rating.count}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setFieldValue("count", newValue);
              validateField("count", newValue);
            }}
          />
          {errors.count && (
            <p id={`${formId}-count-error`} className="mt-1 text-xs text-red-600">
              {errors.count}
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}

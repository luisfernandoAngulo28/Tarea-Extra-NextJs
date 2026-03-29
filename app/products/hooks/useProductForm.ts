"use client";

import { useMemo, useState } from "react";
import { safeParse } from "valibot";
import { productSchema } from "@/validations/product.schema";
import { PostProductRequest } from "../interfaces/postproduct.interface";

type ProductFormField =
  | "title"
  | "description"
  | "price"
  | "category"
  | "image"
  | "rate"
  | "count";

function getInitialValues(
  initialProduct?: Partial<PostProductRequest>,
): PostProductRequest {
  return {
    title: initialProduct?.title ?? "",
    description: initialProduct?.description ?? "",
    price: initialProduct?.price ?? 0,
    category: initialProduct?.category ?? "",
    image: initialProduct?.image ?? "",
    rating: {
      rate: initialProduct?.rating?.rate ?? 0,
      count: initialProduct?.rating?.count ?? 0,
    },
  };
}

function getValidationErrors(payload: PostProductRequest): Record<string, string> {
  const result = safeParse(productSchema, payload);

  if (result.success) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  result.issues.forEach((issue) => {
    const path = issue.path?.map((segment) => segment.key).filter(Boolean);
    const field = path?.[path.length - 1];

    if (typeof field === "string" && field.length > 0) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}

export function useProductForm(initialProduct?: Partial<PostProductRequest>) {
  const [payload, setPayload] = useState<PostProductRequest>(
    getInitialValues(initialProduct),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = useMemo(
    () => safeParse(productSchema, payload).success,
    [payload],
  );

  const setFieldValue = (field: ProductFormField, value: string | number) => {
    setPayload((prev) => {
      switch (field) {
        case "rate":
          return {
            ...prev,
            rating: {
              ...prev.rating,
              rate: value as number,
            },
          };
        case "count":
          return {
            ...prev,
            rating: {
              ...prev.rating,
              count: value as number,
            },
          };
        default:
          return {
            ...prev,
            [field]: value,
          };
      }
    });
  };

  const validateField = (field: ProductFormField, value: string | number) => {
    const nextPayload: PostProductRequest = {
      ...payload,
      rating: {
        ...payload.rating,
      },
    };

    switch (field) {
      case "rate":
        nextPayload.rating.rate = value as number;
        break;
      case "count":
        nextPayload.rating.count = value as number;
        break;
      default:
        nextPayload[field] = value as never;
        break;
    }

    const fieldErrors = getValidationErrors(nextPayload);

    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field] || "",
    }));
  };

  const validateForm = () => {
    const fieldErrors = getValidationErrors(payload);
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const resetForm = () => {
    setPayload(getInitialValues(initialProduct));
    setErrors({});
  };

  return {
    payload,
    errors,
    isFormValid,
    setErrors,
    resetForm,
    setFieldValue,
    validateField,
    validateForm,
  };
}

import { apiFetch } from "@/service/api";
import {
  DeleteProductResponse,
  PostProductRequest,
  PostProductResponse,
} from "../interfaces/postproduct.interface";

export function getProducts() {
  return apiFetch("/products");
}

export function postProduct(
  data: PostProductRequest,
): Promise<PostProductResponse> {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number): Promise<DeleteProductResponse> {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
}

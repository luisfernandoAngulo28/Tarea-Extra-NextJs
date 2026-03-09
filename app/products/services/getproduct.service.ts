import { GetProductResponse } from "../interfaces/getproduct.interface";

export async function getProducts(): Promise<GetProductResponse[]> {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }
  const data = await response.json();
  return data;
}

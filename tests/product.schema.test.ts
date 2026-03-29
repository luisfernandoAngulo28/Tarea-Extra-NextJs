import { describe, expect, it } from "vitest";
import { safeParse } from "valibot";
import { productSchema } from "../validations/product.schema";

describe("productSchema", () => {
  it("valida un producto correcto", () => {
    const result = safeParse(productSchema, {
      title: "Camiseta premium",
      description: "Camiseta comoda y durable para uso diario.",
      price: 35,
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: {
        rate: 4.6,
        count: 120,
      },
    });

    expect(result.success).toBe(true);
  });

  it("devuelve errores cuando faltan datos minimos", () => {
    const result = safeParse(productSchema, {
      title: "ab",
      description: "corta",
      price: 0,
      category: "a",
      image: "url-invalida",
      rating: {
        rate: -1,
        count: -4,
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });
});

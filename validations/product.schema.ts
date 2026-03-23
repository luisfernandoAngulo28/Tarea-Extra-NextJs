import {
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
  url,
} from "valibot";

export const productSchema = object({
  title: pipe(
    string(),
    minLength(3, "El título debe tener al menos 3 caracteres"),
  ),
  description: pipe(
    string(),
    minLength(10, "La descripción debe tener al menos 10 caracteres"),
  ),
  price: pipe(number(), minValue(1, "El precio debe ser mayor a 0")),
  category: pipe(
    string(),
    minLength(3, "La categoría debe tener al menos 3 caracteres"),
  ),
  image: pipe(string(), url("La URL de la imagen no es válida")),
  rating: object({
    rate: pipe(number(), minValue(0, "El rating no puede ser negativo")),
    count: pipe(
      number(),
      minValue(0, "El cantidad de reviews no puede ser negativa"),
    ),
  }),
});

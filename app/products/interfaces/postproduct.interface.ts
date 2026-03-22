export interface PostProductRequest {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface PostProductResponse {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface DeleteProductResponse {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

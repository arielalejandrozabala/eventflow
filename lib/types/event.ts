export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type Event = {
  slug: string;
  title: string;
  description: string;
  products?: Product[];
  expiresAt: string; // ISO date string
};
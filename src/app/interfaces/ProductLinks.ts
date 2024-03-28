interface ProductLink {
  href: string;
}
export default interface ProductLinks {
  self: ProductLink[];
  collection: ProductLink[];
  up: ProductLink[];
}

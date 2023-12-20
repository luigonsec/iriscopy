export default interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string | null;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: unknown[]; // Definir una interfaz adecuada si es necesario
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: unknown[]; // Definir una interfaz adecuada si es necesario
  images: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }[];
  attributes: unknown[]; // Definir una interfaz adecuada si es necesario
  default_attributes: unknown[]; // Definir una interfaz adecuada si es necesario
  variations: unknown[]; // Definir una interfaz adecuada si es necesario
  grouped_products: unknown[]; // Definir una interfaz adecuada si es necesario
  menu_order: number;
  meta_data: {
    id: number;
    key: string;
    value: unknown; // Definir un tipo más específico si es necesario
  }[];
  yoast_head: string;
  yoast_head_json: unknown; // Definir una interfaz adecuada si es necesario
  _links: {
    self: {
      href: string;
    }[];
    collection: {
      href: string;
    }[];
  };
}

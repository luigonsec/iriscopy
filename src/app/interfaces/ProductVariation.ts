import ProductAttribute from './ProductAttribute';
import ProductDimension from './ProductDimenstion';
import ProductImage from './ProductImage';
import ProductLinks from './ProductLinks';
import ProductMetaData from './ProductMetaData';

export default interface ProductVariation {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: null | string;
  date_on_sale_from_gmt: null | string;
  date_on_sale_to: null | string;
  date_on_sale_to_gmt: null | string;
  on_sale: boolean;
  status: string;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: unknown[]; // Aquí se puede definir una interfaz más detallada si se conoce el formato de los objetos dentro del array.
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: null | number;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: null | number;
  weight: string;
  dimensions: ProductDimension;
  shipping_class: string;
  shipping_class_id: number;
  image: ProductImage;
  attributes: ProductAttribute[];
  menu_order: number;
  meta_data: ProductMetaData[];
  _links: ProductLinks;
}

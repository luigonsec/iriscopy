import BillingDetails from './BillingDetails';
import ShippingDetails from './ShippingDetails';

export default interface Customer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: BillingDetails;
  shipping: ShippingDetails;
  is_paying_customer: boolean;
  orders_count: number;
  total_spent: string;
  avatar_url: string;
  meta_data: MetaData[];
  _links: Links;
}

interface MetaData {
  id: number;
  key: string;
  value: any;
}

interface Links {
  self: Href[];
  collection: Href[];
}

interface Href {
  href: string;
}

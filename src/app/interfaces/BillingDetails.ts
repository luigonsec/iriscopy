export default interface BillingDetails {
  first_name: string;
  last_name?: string;
  company?: string;
  responsible: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  others: string;
}

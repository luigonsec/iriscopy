export default interface Banner {
  id?: number;
  url: string;
  visible_phone: boolean;
  visible_pc: boolean;

  visible_shop: boolean;
  visible_print: boolean;
  link_to?: string;
}

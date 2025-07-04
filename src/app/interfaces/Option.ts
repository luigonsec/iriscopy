export default interface Option {
  name: string;
  code: string;
  description?: string;
  default?: boolean;
  factor?: number;
  group?: string;
}

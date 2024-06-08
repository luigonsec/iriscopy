export default interface BoundColor {
  id: number;
  sides: string[];
  color: string;
  name: string;
  default?: boolean;
  factor: number;
}

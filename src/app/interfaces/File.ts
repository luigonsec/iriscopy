export default interface File {
  id: string | number;
  name: string;
  size: number;
  pages: number;
  url: string;
  original_filename: string;
  source: string;
  image: string;
  pageDimensions?: PageDimensions[];
}

export interface PageDimensions {
  width: number;
  height: number;
}

import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Revista {
  id?: string;
  cover_paperType: Option;
  inner_paperType: Option;
  format: Option;
  vertical_size: Option;
  horizontal_size: Option;
  square_size: Option;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

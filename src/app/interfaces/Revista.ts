import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Revista extends Orderable {
  cover_paperType: Option;
  inner_paperType: Option;
  format: Option;
  vertical_size: Option;
  horizontal_size: Option;
  square_size: Option;
  copiesQuantity: number;
  files: File[];
}

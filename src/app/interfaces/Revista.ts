import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Revista extends Orderable {
  finishType: Option;
  cover_paperCategory: Option;
  cover_paperType: Option;
  inner_paperCategory: Option;
  inner_paperType: Option;
  format: Option;
  paperSize: Option;
  copiesQuantity: number;
  files: File[];
}

import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Flyer extends Orderable {
  printForm: Option;
  paperCategory: Option;
  paperType: Option;
  paperSize: Option;
  size: { height: number; width: number };
  copiesQuantity: number;
  files: File[];
}

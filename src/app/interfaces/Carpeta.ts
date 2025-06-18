import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Flyer extends Orderable {
  printForm: Option;
  paperType: Option;
  paperSize: Option;
  finishType: Option;
  copiesQuantity: number;
  files: File[];
}

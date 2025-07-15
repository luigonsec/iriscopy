import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Diptico extends Orderable {
  paperType: Option;
  format: Option;
  printForm: Partial<Option>;
  paperSize: Option;
  copiesQuantity: number;
  files: File[];
}

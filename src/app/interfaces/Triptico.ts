import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Triptico extends Orderable {
  paperType: Option;
  format: Option;
  paperSize: Option;
  copiesQuantity: number;
  files: File[];
}

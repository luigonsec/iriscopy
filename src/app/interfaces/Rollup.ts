import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface Rollup extends Orderable {
  size: Option;
  copiesQuantity: number;
  files: File[];
}

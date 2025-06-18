import Option from './Option';
import File from 'src/app/interfaces/File';
import Orderable from './Orderable';

export default interface TarjetaVisita extends Orderable {
  printForm: Option;
  paperType: Option;
  finishType: Option;
  copiesQuantity: number;
  files: File[];
}

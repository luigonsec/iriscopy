import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface TarjetaVisita {
  id?: string;
  printForm: Option;
  paperType: Option;
  finishType: Option;
  copiesQuantity: number;
  additionalComments: string;
  files: File[];
}

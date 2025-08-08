import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Cartel {
  id?: string;
  printForm: Option;
  paperSize: Option;
  paperCategory: Option;
  paperType: Option;
  size?: any;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Flyer {
  id?: string;
  printForm: Option;
  paperType: Option;
  paperSize: Option;
  size: { height: number; width: number };
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

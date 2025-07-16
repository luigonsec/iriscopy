import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Cartel {
  id?: string;
  paperSize: Option;
  paperType: Option;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

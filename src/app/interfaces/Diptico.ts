import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Diptico {
  paperType: Option;
  format: Option;
  paperSize: Option;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

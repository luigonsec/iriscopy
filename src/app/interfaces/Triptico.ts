import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Triptico {
  paperType: Option;
  format: Option;
  size: Option;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

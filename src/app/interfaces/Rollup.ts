import Option from './Option';
import File from 'src/app/interfaces/File';

export default interface Rollup {
  id?: string;
  size: Option;
  copiesQuantity: number;
  files: File[];
  additionalComments: string;
}

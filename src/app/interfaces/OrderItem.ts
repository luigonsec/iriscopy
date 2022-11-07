import BoundColor from './BoundColor';
import File from './File';
import Option from './Option';

export interface OrderItem {
  id?: string;
  orientation: Option;
  finishType: Option;
  pagesPerSide: Option;
  printForm: Option;
  printType: Option;
  paperGrammage: Option;
  paperSize: Option;
  boundType: Option;

  boundColors: {
    delantera: BoundColor;
    anillas: BoundColor;
    trasera: BoundColor;
  };

  copiesQuantity: number;
  additionalComments: string;
  files: File[];
}

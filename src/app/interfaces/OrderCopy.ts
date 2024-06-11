import BoundColor from './BoundColor';
import File from './File';
import Option from './Option';
import RingColor from './RingColor';

export interface OrderCopy {
  id?: string;
  orientation: Option;
  finishType: Option;
  pagesPerSide: Option;
  printForm: Option;
  printType: Option;
  paperType: Option;
  paperSize: Option;
  boundType: Option;

  boundColors: {
    delantera: BoundColor;
    anillas: RingColor;
    trasera: BoundColor;
  };

  copiesQuantity: number;
  additionalComments: string;
  files: File[];
}

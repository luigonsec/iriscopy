import Option from './Option';

interface BoundColor {
  id: number;
  color: string;
  name: string;
}

export interface Order {
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
  file: any;
}

import { Component } from '@angular/core';
import Option from './interfaces/Option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public orientation: Option;
  public finishType: Option;
  public pagesPerSide: Option;
  public printForm: Option;
  public printType: Option;
  public paperGrammage: Option;
  public paperSize: Option;
  public boundType: Option = {
    name: 'Individualmente',
    code: 'individual',
    description: 'Por cada documento',
  };
  public boundColors: {
    delantera: { id: number; color: string; name: string };
    anillas: { id: number; color: string; name: string };
    trasera: { id: number; color: string; name: string };
  } = {
    delantera: undefined,
    anillas: undefined,
    trasera: undefined,
  };

  public copiesQuantity: number;
  public additionalComments: string;

  title = 'iriscopy';

  getPaperGrammage(value) {
    this.paperGrammage = value;
  }

  getPaperSize(value) {
    this.paperSize = value;
  }

  getPagesPerSide(value) {
    this.pagesPerSide = value;
  }

  getPrintType(value) {
    this.printType = value;
  }

  getPrintForm(value) {
    this.printForm = value;
  }

  getFinishType(value) {
    this.finishType = value;
  }

  getOrientation(value) {
    this.orientation = value;
  }

  getCopiesQuantity(value) {
    this.copiesQuantity = value;
  }

  getBoundType(value) {
    this.boundType = value;
  }

  getBoundColors(value) {
    this.boundColors = value;
  }

  getAdditionalComments(value) {
    this.additionalComments = value;
  }
}

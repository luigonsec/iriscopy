import { Component } from '@angular/core';

import Option from './interfaces/Option';
import { Order } from './interfaces/Order';
import options from 'src/config/options';
import File from './interfaces/File';

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
  public boundType: Option = options.boundTypes.find((x) => x.default);

  public boundColors = {
    delantera: options.colorsCover.find((x) => x.default),
    anillas: options.colorsRings.find((x) => x.default),
    trasera: options.colorsCover.find((x) => x.default),
  };

  public copiesQuantity: number;
  public additionalComments: string;
  public order: Order;
  public files: File[];

  constructor() {
    this.order = {
      orientation: this.orientation,
      finishType: this.finishType,
      pagesPerSide: this.pagesPerSide,
      printForm: this.printForm,
      printType: this.printType,
      paperGrammage: this.paperGrammage,
      paperSize: this.paperSize,
      boundType: this.boundType,
      boundColors: this.boundColors,
      copiesQuantity: this.copiesQuantity,
      additionalComments: this.additionalComments,
      files: this.files,
    };
  }

  getPaperGrammage(value) {
    this.paperGrammage = value;
    this.order.paperGrammage = this.paperGrammage;
  }

  getPaperSize(value) {
    this.paperSize = value;
    this.order.paperSize = this.paperSize;
  }

  getPagesPerSide(value) {
    this.pagesPerSide = value;
    this.order.pagesPerSide = this.pagesPerSide;
  }

  getPrintType(value) {
    this.printType = value;
    this.order.printType = this.printType;
  }

  getPrintForm(value) {
    this.printForm = value;
    this.order.printForm = this.printForm;
  }

  getFinishType(value) {
    this.finishType = value;
    this.order.finishType = this.finishType;
  }

  getOrientation(value) {
    this.orientation = value;
    this.order.orientation = this.orientation;
  }

  getCopiesQuantity(value) {
    this.copiesQuantity = value;
    this.order.copiesQuantity = this.copiesQuantity;
  }

  getBound(value) {
    this.boundType = value.boundType;
    this.boundColors = value.boundColors;

    this.order.boundType = this.boundType;
    this.order.boundColors = this.boundColors;
  }

  getAdditionalComments(value) {
    this.additionalComments = value;
    this.order.additionalComments = this.additionalComments;
  }

  getFile(files) {
    this.files = files;
    this.order.files = this.files;
  }

  isReady() {
    let res = true;

    if (!!!this.orientation) res = false;
    if (!!!this.finishType) res = false;
    if (!!!this.pagesPerSide) res = false;
    if (!!!this.printForm) res = false;
    if (!!!this.printType) res = false;
    if (!!!this.paperGrammage) res = false;
    if (!!!this.paperSize) res = false;

    if (this.finishType.code === 'encuadernado') {
      if (!!!this.boundType) res = false;
      if (!!!this.boundColors || !!!this.boundColors.anillas) res = false;
      if (!!!this.boundColors || !!!this.boundColors.delantera) res = false;
      if (!!!this.boundColors || !!!this.boundColors.trasera) res = false;
    }

    if (!!!this.copiesQuantity) res = false;
    if (!!!this.files || !!!this.files.length) res = false;

    return res;
  }
}

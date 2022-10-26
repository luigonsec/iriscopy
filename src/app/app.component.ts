import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import Option from './interfaces/Option';
import { Order } from './interfaces/Order';
import { OrdersService } from './services/orders.service';

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
  public boundType: Option;

  public boundColors;

  public copiesQuantity: number;
  public additionalComments: string;
  public order: Order;
  public file: any;

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
      file: this.file,
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

  getFile(file) {
    this.file = file;
    this.order.file = this.file;
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
    if (!!!this.file) res = false;

    return res;
  }
}

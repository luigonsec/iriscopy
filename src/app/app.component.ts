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
  public ready: boolean = true;
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

  getBoundType(value) {
    this.boundType = value;
    this.order.boundType = this.boundType;
  }

  getBoundColors(value) {
    this.boundColors = value;
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
    if (!!!this.orientation) return false;
    if (!!!this.finishType) return false;
    if (!!!this.pagesPerSide) return false;
    if (!!!this.printForm) return false;
    if (!!!this.printType) return false;
    if (!!!this.paperGrammage) return false;
    if (!!!this.paperSize) return false;
    if (!!!this.boundType) return false;

    if (this.finishType.code === 'encuadernado') {
      if (!!!this.boundColors.anillas) return false;
      if (!!!this.boundColors.delantera) return false;
      if (!!!this.boundColors.trasera) return false;
    }

    if (!!!this.copiesQuantity) return false;
    if (!!!this.file) return false;

    return true;
  }
}

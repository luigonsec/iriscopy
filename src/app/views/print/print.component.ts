import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import Option from 'src/app/interfaces/Option';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import options from 'src/config/options';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { OrdersService } from 'src/app/services/orders.service';
import { Store } from '@ngrx/store';
import { clearCoupon } from 'src/app/_actions/coupons.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
})
export class PrintComponent implements OnInit, OnDestroy {
  public orientation: Option;
  public finishType: Option;
  public pagesPerSide: Option;
  public printForm: Option;
  public printType: Option;
  public paperGrammage: Option;
  public paperSize: Option;
  public boundType: Option = options.boundTypes.find((x) => x.default);

  public boundColors = {
    delantera: options.colorsCover
      .filter((x) => x.sides.includes('delantera'))
      .find((x) => x.default),
    anillas: options.colorsRings.find((x) => x.default),
    trasera: options.colorsCover
      .filter((x) => x.sides.includes('trasera'))
      .find((x) => x.default),
  };

  public copiesQuantity: number;
  public additionalComments: string;
  public files: File[];
  public order: OrderCopy;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor(private orderService: OrdersService, private store: Store) {
    this.reset = this.reset.bind(this);

    this.store.dispatch(clearCoupon());

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

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  reset() {
    this.uploader.clear();
  }

  getPaperGrammage(value) {
    this.paperGrammage = value;
    this.order.paperGrammage = this.paperGrammage;
    this.order = Object.assign({}, this.order);
  }

  getPaperSize(value) {
    this.paperSize = value;
    this.order.paperSize = this.paperSize;
    this.order = Object.assign({}, this.order);
  }

  getPagesPerSide(value) {
    this.pagesPerSide = value;
    this.order.pagesPerSide = this.pagesPerSide;
    this.order = Object.assign({}, this.order);
  }

  getPrintType(value) {
    this.printType = value;
    this.order.printType = this.printType;
    this.order = Object.assign({}, this.order);
  }

  getPrintForm(value) {
    this.printForm = value;
    this.order.printForm = this.printForm;
    this.order = Object.assign({}, this.order);
  }

  getFinishType(value) {
    this.finishType = value;
    this.order.finishType = this.finishType;
    this.order = Object.assign({}, this.order);
  }

  getOrientation(value) {
    this.orientation = value;
    this.order.orientation = this.orientation;
    this.order = Object.assign({}, this.order);
  }

  getCopiesQuantity(value) {
    this.copiesQuantity = value;
    this.order.copiesQuantity = this.copiesQuantity;
    this.order = Object.assign({}, this.order);
  }

  getBound(value) {
    this.boundType = value.boundType;
    this.boundColors = value.boundColors;

    this.order.boundType = this.boundType;
    this.order.boundColors = this.boundColors;
    this.order = Object.assign({}, this.order);
  }

  getAdditionalComments(value) {
    this.additionalComments = value;
    this.order.additionalComments = this.additionalComments;
    this.order = Object.assign({}, this.order);
  }

  getFile(files) {
    this.files = files;
    this.order.files = this.files;
    this.order = Object.assign({}, this.order);
  }

  isReady() {
    let res = true;

    if (!this.orientation) res = false;
    if (!this.finishType) res = false;
    if (!this.pagesPerSide) res = false;
    if (!this.printForm) res = false;
    if (!this.printType) res = false;
    if (!this.paperGrammage) res = false;
    if (!this.paperSize) res = false;

    if (this.finishType.code === 'encuadernado') {
      if (!this.boundType) res = false;
      if (!this.boundColors || !this.boundColors.anillas) res = false;
      if (!this.boundColors || !this.boundColors.delantera) res = false;
      if (!this.boundColors || !this.boundColors.trasera) res = false;
    }

    if (!this.copiesQuantity) res = false;
    if (!this.files || !this.files.length) res = false;

    return res;
  }

  prepareOrderToEdit(order: OrderCopy) {
    this.order = order;
    this.paperSize = order.paperSize;
    this.paperGrammage = order.paperGrammage;
    this.printType = order.printType;
    this.printForm = order.printForm;
    this.orientation = order.orientation;
    this.pagesPerSide = order.pagesPerSide;
  }

  ngOnInit() {
    const orderToEdit = this.orderService.getOrderToEdit();
    if (orderToEdit) {
      this.prepareOrderToEdit(orderToEdit);
    }

    this.orderSubscription = this.orderService.getOrder().subscribe((order) => {
      this.order = order;
      this.order = Object.assign({}, this.order);
    });
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import { OrderCopy } from 'src/app/interfaces/OrderCopy';
import options from 'src/config/options';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { OrdersService } from 'src/app/services/orders.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ShopcartService } from '../../services/shopcart.service';
import { PricesService } from '../../services/prices.service';
@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss'],
    standalone: false
})
export class PrintComponent implements OnInit, OnDestroy {
  public orientation: Option;
  public finishType: Option;
  public pagesPerSide: Option;
  public printForm: Option;
  public printType: Option;
  public printTypeCover: Option;
  public paperType: Option;
  public paperSize: Option;
  public boundType: Option = options.boundTypes.find((x) => x.default);
  public boundPages: Option = options.boundPages.find((x) => x.default);

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

  constructor(
    private orderService: OrdersService,
    private analytics: AnalyticsService,
    private shopcartService: ShopcartService,
    private pricesService: PricesService
  ) {
    this.reset = this.reset.bind(this);
    this.order = {
      orientation: this.orientation,
      finishType: this.finishType,
      pagesPerSide: this.pagesPerSide,
      printForm: this.printForm,
      printType: this.printType,
      printTypeCover: this.printTypeCover,
      paperType: this.paperType,
      paperSize: this.paperSize,
      boundType: this.boundType,
      boundPages: this.boundPages,
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

  removeFile(id) {
    this.files = this.files.filter((x) => x.id !== id);
  }

  getPaperType(value) {
    this.paperType = value;
    this.order.paperType = this.paperType;
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
    this.order.printTypeCover = this.printType;
    this.order = Object.assign({}, this.order);
  }

  // getPrintTypeCover(value) {
  //   this.printTypeCover = value;
  //   this.order.printTypeCover = this.printTypeCover;
  //   this.order = Object.assign({}, this.order);
  // }

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
    this.boundPages = value.boundPages;
    this.boundType = value.boundType;
    this.boundColors = value.boundColors;

    this.order.boundType = this.boundType;
    this.order.boundColors = this.boundColors;
    this.order.boundPages = this.boundPages;

    this.order = Object.assign({}, this.order);
  }

  getAdditionalComments(value) {
    this.additionalComments = value;
    this.order.additionalComments = this.additionalComments;
    this.order = Object.assign({}, this.order);
  }

  getFile(files) {
    this.files = files.map((file) => Object.assign({}, file));
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
    if (!this.paperType) res = false;
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
    this.paperType = order.paperType;
    this.printType = order.printType;
    this.printForm = order.printForm;
    this.orientation = order.orientation;
    this.pagesPerSide = order.pagesPerSide;
  }

  getPrecio = async () => {
    const others = this.shopcartService.getCart().copies;
    others.push(this.order);
    const res = await firstValueFrom(
      this.pricesService.getCopyPrice(this.order, others)
    );
    return res;
  };

  addToCartFn = async (order: OrderCopy) => {
    return this.shopcartService.addCopyToCart.bind(this.shopcartService)(order);
  };

  ngOnInit() {
    this.analytics.verListadoImpresiones([]);
    this.orderSubscription = this.orderService.getOrder().subscribe((order) => {
      this.order = order;
      this.order = Object.assign({}, this.order);
    });
  }
}

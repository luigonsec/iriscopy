import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { OrdersService } from 'src/app/services/orders.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
@Component({
  selector: 'app-view-tarjetas-visita',
  templateUrl: './view-tarjetas-visita.component.html',
  styleUrls: ['./view-tarjetas-visita.component.scss'],
})
export class ViewTarjetasVisitaComponent implements OnInit {
  public finishType: Option;
  public printForm: Option;
  public paperType: Option;

  public copiesQuantity: number;
  public additionalComments: string;
  public files: File[];
  public order: TarjetaVisita;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor(
    private orderService: OrdersService,
    private analytics: AnalyticsService
  ) {
    this.reset = this.reset.bind(this);
    this.order = {
      printForm: this.printForm,
      paperType: this.paperType,
      finishType: this.finishType,
      copiesQuantity: this.copiesQuantity,
      additionalComments: this.additionalComments,
      files: this.files,
    };
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

  getCopiesQuantity(value) {
    this.copiesQuantity = value;
    this.order.copiesQuantity = this.copiesQuantity;
    this.order = Object.assign({}, this.order);
  }

  getAdditionalComments(value) {
    this.additionalComments = value;
    this.order.additionalComments = this.additionalComments;
    this.order = Object.assign({}, this.order);
  }

  isReady() {
    let res = true;

    if (!this.finishType) res = false;
    if (!this.printForm) res = false;
    if (!this.paperType) res = false;
    if (!this.copiesQuantity) res = false;
    if (!this.files || !this.files.length) res = false;

    return res;
  }

  prepareOrderToEdit(order: TarjetaVisita) {
    this.order = order;
    this.paperType = order.paperType;
    this.printForm = order.printForm;
  }

  getFile(files) {
    this.files = files.map((file) => Object.assign({}, file));
    this.order.files = this.files;
    this.order = Object.assign({}, this.order);
  }

  ngOnInit() {
    // this.analytics.verListadoImpresiones([]);
    // this.orderSubscription = this.orderService.getOrder().subscribe((order) => {
    //   this.order = order;
    //   this.order = Object.assign({}, this.order);
    // });
  }
}

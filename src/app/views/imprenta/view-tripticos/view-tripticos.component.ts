import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import tripricoOptions from 'src/config/tripticos';
import Triptico from '../../../interfaces/Triptico';
@Component({
  selector: 'app-view-tripticos',
  templateUrl: './view-tripticos.component.html',
  styleUrls: ['./view-tripticos.component.scss'],
})
export class ViewTripticosComponent implements OnInit {
  public tripricoOptions = tripricoOptions;

  public size: Option;
  public paperType: Option;
  public format: Option;
  public copiesQuantity: number;

  public additionalComments: string;
  public files: File[];
  public order: Triptico;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    this.reset = this.reset.bind(this);
    this.order = {
      size: this.size,
      paperType: this.paperType,
      format: this.format,
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

  getSize(value) {
    this.order.size = value;
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

  getFormat(value) {
    this.format = value;
    this.order.format = this.format;
    this.order = Object.assign({}, this.order);
  }

  isReady() {
    let res = true;

    if (!this.paperType) res = false;
    if (!this.copiesQuantity) res = false;
    if (!this.files || !this.files.length) res = false;

    return res;
  }

  prepareOrderToEdit(order: Triptico) {
    this.order = order;
    this.paperType = order.paperType;
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

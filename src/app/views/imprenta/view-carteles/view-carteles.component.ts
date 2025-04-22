import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import cartelesOptions from 'src/config/carteles';
import Cartel from '../../../interfaces/Cartel';
@Component({
  selector: 'app-view-carteles',
  templateUrl: './view-carteles.component.html',
  styleUrls: ['./view-carteles.component.scss'],
})
export class ViewCartelesComponent implements OnInit {
  public cartelesOptions = cartelesOptions;

  public size: Option;
  public paperType: Option;
  public copiesQuantity: number;

  public additionalComments: string;
  public files: File[];
  public order: Cartel;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    this.reset = this.reset.bind(this);
    this.order = {
      size: this.size,
      paperType: this.paperType,
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

  isCustomSize() {
    if (this.order.size) {
      if (this.order.size.code === 'personalizado') {
        return true;
      }
    }
    return false;
  }

  getPaperType(value) {
    this.paperType = value;
    this.order.paperType = this.paperType;
    this.order = Object.assign({}, this.order);
  }

  getPaperSize(value) {
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

  isReady() {
    let res = true;

    if (!this.paperType) res = false;
    if (!this.copiesQuantity) res = false;
    if (!this.files || !this.files.length) res = false;

    return res;
  }

  prepareOrderToEdit(order: Cartel) {
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

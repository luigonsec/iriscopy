import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import revistasOptions from 'src/config/revistas';
import Revista from '../../../interfaces/Revista';
@Component({
  selector: 'app-view-revistas',
  templateUrl: './view-revistas.component.html',
  styleUrls: ['./view-revistas.component.scss'],
})
export class ViewRevistasComponent implements OnInit {
  public revistasOptions = revistasOptions;

  public cover_paperType: Option;
  public inner_paperType: Option;
  public format: Option;
  public vertical_size: Option;
  public horizontal_size: Option;
  public square_size: Option;

  public copiesQuantity: number;
  public additionalComments: string;
  public files: File[];
  public order: Revista;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    this.reset = this.reset.bind(this);
    this.order = {
      cover_paperType: this.cover_paperType,
      inner_paperType: this.inner_paperType,
      format: this.format,
      vertical_size: this.vertical_size,
      horizontal_size: this.horizontal_size,
      square_size: this.square_size,
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

  getCoverPaperType(value) {
    this.cover_paperType = value;
    this.order.cover_paperType = this.cover_paperType;
    this.order = Object.assign({}, this.order);
  }

  getInnerPaperType(value) {
    this.inner_paperType = value;
    this.order.inner_paperType = this.inner_paperType;
    this.order = Object.assign({}, this.order);
  }

  getFormat(value) {
    this.format = value;
    this.order.format = this.format;
    this.order = Object.assign({}, this.order);
  }

  getSize(value) {
    if (this.format.code === 'vertical') {
      this.getVerticalSize(value);
    } else if (this.format.code === 'horizontal') {
      this.getHorizontalSize(value);
    }
    if (this.format.code === 'cuadrado') {
      this.getSquareSize(value);
    }
  }
  getVerticalSize(value) {
    this.vertical_size = value;
    this.order.vertical_size = this.vertical_size;
    this.order = Object.assign({}, this.order);
  }
  getHorizontalSize(value) {
    this.horizontal_size = value;
    this.order.horizontal_size = this.horizontal_size;
    this.order = Object.assign({}, this.order);
  }
  getSquareSize(value) {
    this.square_size = value;
    this.order.square_size = this.square_size;
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

  isCustomSize() {
    if (
      this.format.code === 'horizontal' &&
      this.horizontal_size &&
      this.horizontal_size.code === 'personalizado'
    ) {
      return true;
    }
    if (
      this.format.code === 'vertical' &&
      this.vertical_size &&
      this.vertical_size.code === 'personalizado'
    ) {
      return true;
    }
    if (
      this.format.code === 'cuadrado' &&
      this.square_size &&
      this.square_size.code === 'personalizado'
    ) {
      return true;
    }

    return false;
  }

  isReady() {
    let res = true;
    if (!this.copiesQuantity) res = false;
    if (!this.files || !this.files.length) res = false;

    return res;
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

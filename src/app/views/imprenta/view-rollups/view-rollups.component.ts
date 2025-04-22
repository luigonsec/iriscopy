import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import rollupsOptions from 'src/config/rollups';
import Rollup from '../../../interfaces/Rollup';
@Component({
  selector: 'app-view-rollups',
  templateUrl: './view-rollups.component.html',
  styleUrls: ['./view-rollups.component.scss'],
})
export class ViewRollupsComponent implements OnInit {
  public rollupsOptions = rollupsOptions;

  public size: Option;

  public copiesQuantity: number;
  public additionalComments: string;
  public files: File[];
  public order: Rollup;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    this.reset = this.reset.bind(this);
    this.order = {
      size: this.size,
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

  getSize(value) {
    this.size = value;
    this.order.size = this.size;
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

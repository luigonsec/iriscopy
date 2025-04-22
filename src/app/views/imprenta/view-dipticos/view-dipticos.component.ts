import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import dipticosOptions from 'src/config/dipticos';
import Diptico from '../../../interfaces/Diptico';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-dipticos',
  templateUrl: './view-dipticos.component.html',
  styleUrls: ['./view-dipticos.component.scss'],
})
export class ViewDipticosComponent extends FormBase<Diptico> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public dipticosOptions = dipticosOptions;

  constructor() {
    super();
  }

  isReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.size) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    return res;
  }

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      format: undefined,
      paperType: undefined,
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

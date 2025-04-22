import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import Carpeta from '../../../interfaces/Carpeta';
import folderOptions from 'src/config/carpetas';
import { FormBase } from '../../../_classes/form-base.class';

@Component({
  selector: 'app-view-carpetas',
  templateUrl: './view-carpetas.component.html',
  styleUrls: ['./view-carpetas.component.scss'],
})
export class ViewCarpetasComponent extends FormBase<Carpeta> implements OnInit {
  public folderOptions = folderOptions;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    super();
  }

  isReady() {
    let res = true;

    if (!this.order.printForm) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.finishType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    return res;
  }

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      printForm: undefined,
      paperType: undefined,
      finishType: undefined,
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import Carpeta from '../../../interfaces/Carpeta';
import folderOptions from 'src/config/carpetas';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';

@Component({
  selector: 'app-view-carpetas',
  templateUrl: './view-carpetas.component.html',
  styleUrls: ['./view-carpetas.component.scss'],
})
export class ViewCarpetasComponent extends FormBase<Carpeta> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public folderOptions = folderOptions;

  constructor(public pricesService: PricesService) {
    super();
  }

  updateReady() {
    let res = true;

    if (!this.order.printForm) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.finishType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getFolderPrice(this.order));
  };

  ngOnInit() {
    this.order = {
      printForm: undefined,
      paperType: undefined,
      finishType: undefined,
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
    super.ngOnInit();
  }
}

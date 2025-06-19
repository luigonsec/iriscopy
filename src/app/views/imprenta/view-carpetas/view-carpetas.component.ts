import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import Carpeta from '../../../interfaces/Carpeta';
import folderOptions from 'src/config/carpetas';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';

@Component({
  selector: 'app-view-carpetas',
  templateUrl: './view-carpetas.component.html',
  styleUrls: ['./view-carpetas.component.scss'],
})
export class ViewCarpetasComponent extends FormBase<Carpeta> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public folderOptions = folderOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService
  ) {
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

  addToCartFn = async (order: Carpeta) => {
    return this.shopCart.addFolderToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
      printForm: undefined,
      paperType: undefined,
      finishType: undefined,
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [
        {
          id: undefined,
          pages: 1,
          name: 'Archivo de prueba',
          image: '',
          original_filename: '',
          size: 0,
          source: 'local',
          url: '',
        },
      ],
    };
    super.ngOnInit();
  }
}

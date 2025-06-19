import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import dipticosOptions from 'src/config/dipticos';
import Diptico from '../../../interfaces/Diptico';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
@Component({
  selector: 'app-view-dipticos',
  templateUrl: './view-dipticos.component.html',
  styleUrls: ['./view-dipticos.component.scss'],
})
export class ViewDipticosComponent extends FormBase<Diptico> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public dipticosOptions = dipticosOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService
  ) {
    super();
  }

  updateReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getDiptychPrice(this.order));
  };

  addToCartFn = async (order: Diptico) => {
    return this.shopCart.addDiptychToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
      format: undefined,
      paperType: undefined,
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

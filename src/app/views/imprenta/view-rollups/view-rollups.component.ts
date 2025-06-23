import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import rollupsOptions from 'src/config/rollups';
import Rollup from '../../../interfaces/Rollup';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
@Component({
  selector: 'app-view-rollups',
  templateUrl: './view-rollups.component.html',
  styleUrls: ['./view-rollups.component.scss'],
})
export class ViewRollupsComponent extends FormBase<Rollup> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public rollupsOptions = rollupsOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService
  ) {
    super();
  }

  updateReady() {
    let res = true;
    if (!this.order.paperSize) res = false;
    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getRollUpPrice(this.order));
  };

  addToCartFn = async (order: Rollup) => {
    return this.shopCart.addRollupToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
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

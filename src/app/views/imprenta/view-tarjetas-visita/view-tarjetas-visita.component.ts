import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
import tarjetaVisitaOptions from 'src/config/tarjetas-visita';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { firstValueFrom } from 'rxjs';
import { ShopcartService } from '../../../services/shopcart.service';
@Component({
  selector: 'app-view-tarjetas-visita',
  templateUrl: './view-tarjetas-visita.component.html',
  styleUrls: ['./view-tarjetas-visita.component.scss'],
})
export class ViewTarjetasVisitaComponent
  extends FormBase<TarjetaVisita>
  implements OnInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  public tarjetaVisitaOptions = tarjetaVisitaOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService
  ) {
    super();
  }

  updateReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(
      this.pricesService.getBusinessCardPrice(this.order)
    );
  };

  addToCartFn = async (order: TarjetaVisita) => {
    return this.shopCart.addBusinessCardToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
      finishType: undefined,
      printForm: undefined,
      paperType: undefined,
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

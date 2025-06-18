import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import tripricoOptions from 'src/config/tripticos';
import Triptico from '../../../interfaces/Triptico';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
@Component({
  selector: 'app-view-tripticos',
  templateUrl: './view-tripticos.component.html',
  styleUrls: ['./view-tripticos.component.scss'],
})
export class ViewTripticosComponent
  extends FormBase<Triptico>
  implements OnInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  public tripricoOptions = tripricoOptions;

  constructor(public pricesService: PricesService) {
    super();
  }

  updateReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.size) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(
      this.pricesService.getTriptychPrice(this.order)
    );
  };

  ngOnInit() {
    this.order = {
      format: undefined,
      paperType: undefined,
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [
        {
          id: '',
          name: '',
          size: 0,
          url: '',
          pages: 0,
          original_filename: '',
          source: '',
          image: '',
        },
      ],
    };
    super.ngOnInit();
  }
}

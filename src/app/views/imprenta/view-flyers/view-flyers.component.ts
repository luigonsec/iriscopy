import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import Flyer from '../../../interfaces/Flyer';
import flyerOptions from 'src/config/flyers';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-view-flyers',
  templateUrl: './view-flyers.component.html',
  styleUrls: ['./view-flyers.component.scss'],
})
export class ViewFlyersComponent extends FormBase<Flyer> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public flyerOptions = flyerOptions;

  constructor(public pricesService: PricesService) {
    super();
  }

  isCustomSize() {
    if (this.order.paperSize) {
      if (this.order.paperSize.code === 'personalizado') {
        return true;
      }
    }
    return false;
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
    return await firstValueFrom(this.pricesService.getFlyerPrice(this.order));
  };

  ngOnInit() {
    this.order = {
      paperSize: undefined,
      printForm: undefined,
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

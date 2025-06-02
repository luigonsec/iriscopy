import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import rollupsOptions from 'src/config/rollups';
import Rollup from '../../../interfaces/Rollup';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
@Component({
  selector: 'app-view-rollups',
  templateUrl: './view-rollups.component.html',
  styleUrls: ['./view-rollups.component.scss'],
})
export class ViewRollupsComponent extends FormBase<Rollup> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public rollupsOptions = rollupsOptions;

  constructor(public pricesService: PricesService) {
    super();
  }

  isReady() {
    let res = true;
    if (!this.order.size) res = false;
    return res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getRollUpPrice(this.order));
  };

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [
        {
          id: undefined,
          pages: 5,
          name: '',
          image: '',
          original_filename: '',
          size: 0,
          source: 'local',
          url: '',
        },
      ],
    };
  }
}

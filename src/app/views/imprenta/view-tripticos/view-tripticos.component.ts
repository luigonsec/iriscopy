import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import tripricoOptions from 'src/config/tripticos';
import Triptico from '../../../interfaces/Triptico';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-tripticos',
  templateUrl: './view-tripticos.component.html',
  styleUrls: ['./view-tripticos.component.scss'],
})
export class ViewTripticosComponent
  extends FormBase<Triptico>
  implements OnInit
{
  public tripricoOptions = tripricoOptions;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

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

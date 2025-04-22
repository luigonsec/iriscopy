import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
import tarjetaVisitaOptions from 'src/config/tarjetas-visita';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-tarjetas-visita',
  templateUrl: './view-tarjetas-visita.component.html',
  styleUrls: ['./view-tarjetas-visita.component.scss'],
})
export class ViewTarjetasVisitaComponent
  extends FormBase<TarjetaVisita>
  implements OnInit
{
  public tarjetaVisitaOptions = tarjetaVisitaOptions;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    super();
  }

  isReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    return res;
  }

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      finishType: undefined,
      printForm: undefined,
      paperType: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

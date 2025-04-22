import { Component, OnInit, ViewChild } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import File from 'src/app/interfaces/File';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import { Subscription } from 'rxjs';
import revistasOptions from 'src/config/revistas';
import Revista from '../../../interfaces/Revista';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-revistas',
  templateUrl: './view-revistas.component.html',
  styleUrls: ['./view-revistas.component.scss'],
})
export class ViewRevistasComponent extends FormBase<Revista> implements OnInit {
  public revistasOptions = revistasOptions;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {
    super();
  }

  isCustomSize() {
    const formatKey =
      this.order.format.code === 'cuadrado' ? 'square' : this.order.format.code;
    return this.order[`${formatKey}_size`]?.code === 'personalizado';
  }

  isReady() {
    let res = true;

    if (!this.order.cover_paperType) res = false;
    if (!this.order.inner_paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    return res;
  }

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      format: undefined,
      vertical_size: undefined,
      horizontal_size: undefined,
      square_size: undefined,
      inner_paperType: undefined,
      cover_paperType: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

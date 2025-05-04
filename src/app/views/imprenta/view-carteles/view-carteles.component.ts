import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import cartelesOptions from 'src/config/carteles';
import Cartel from '../../../interfaces/Cartel';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-carteles',
  templateUrl: './view-carteles.component.html',
  styleUrls: ['./view-carteles.component.scss'],
})
export class ViewCartelesComponent extends FormBase<Cartel> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public cartelesOptions = cartelesOptions;

  constructor() {
    super();
  }

  isCustomSize() {
    if (this.order.size) {
      if (this.order.size.code === 'personalizado') {
        return true;
      }
    }
    return false;
  }

  getPrice = async () => {
    return Promise.resolve({ precio: 55, notas: [] as string[] });
  };

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
      paperType: undefined,
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

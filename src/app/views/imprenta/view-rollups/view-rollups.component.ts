import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import rollupsOptions from 'src/config/rollups';
import Rollup from '../../../interfaces/Rollup';
import { FormBase } from '../../../_classes/form-base.class';
@Component({
  selector: 'app-view-rollups',
  templateUrl: './view-rollups.component.html',
  styleUrls: ['./view-rollups.component.scss'],
})
export class ViewRollupsComponent extends FormBase<Rollup> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  public rollupsOptions = rollupsOptions;

  constructor() {
    super();
  }

  isReady() {
    let res = true;

    if (!this.order.size) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    return res;
  }

  ngOnInit() {
    super.ngOnInit();
    this.order = {
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
  }
}

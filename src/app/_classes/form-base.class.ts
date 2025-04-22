import { Subscription } from 'rxjs';
import { Component, Input, ViewChild } from '@angular/core';
import { UploaderComponent } from '../components/uploader/uploader.component';

@Component({
  selector: 'app-form-base',
  template: '',
})
export abstract class FormBase<T> {
  public order: T;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {}

  reset() {
    this.uploader.clear();
  }

  removeFile(id) {
    this.order['files'] = this.order['files'].filter((x) => x.id !== id);
  }

  getProperty(property, value) {
    this.order[property] = value;
    this.order = Object.assign({}, this.order);
  }

  abstract isReady(): boolean;

  getFile(files) {
    this.order['files'] = files.map((file) => Object.assign({}, file));
    this.order['files'] = this.order['files'];
    this.order = Object.assign({}, this.order);
  }

  ngOnInit() {
    this.reset = this.reset.bind(this);
  }
}

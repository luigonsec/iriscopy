import { Subscription } from 'rxjs';
import { Component, Input, ViewChild } from '@angular/core';
import { UploaderComponent } from '../components/uploader/uploader.component';

@Component({
  selector: 'app-form-base',
  template: '',
})
export abstract class FormBase<T> {
  public order: T;
  public ready = false;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {}

  reset() {
    this.uploader.clear();
    this.updateReady();
  }

  removeFile(id) {
    this.order['files'] = this.order['files'].filter((x) => x.id !== id);
    this.updateReady();
  }

  getProperty(property, value) {
    this.order[property] = value;
    this.order = Object.assign({}, this.order);
    this.updateReady();
  }

  abstract updateReady(): void;

  abstract getPrice(): Promise<{ precio: number; notas: string[] }>;

  abstract addToCartFn(order: T): Promise<void>;

  getFile(files) {
    this.order['files'] = files.map((file) => Object.assign({}, file));
    this.order['files'] = this.order['files'];
    this.order = Object.assign({}, this.order);
    this.updateReady();
  }

  ngOnInit() {
    this.reset = this.reset.bind(this);
    this.updateReady();
  }
}

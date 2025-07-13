import { Subscription } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { UploaderComponent } from '../components/uploader/uploader.component';
import File from '../interfaces/File';

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
    this.undoPresetProperties();
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

  public validateFiles(files: File[]) {
    return true;
  }

  public presetProperties(file: File) {
    return;
  }

  public undoPresetProperties() {
    return;
  }

  public displayFileUploadInstructions() {
    return;
  }

  getFile(files: File[]) {
    const isValid = this.validateFiles(files);

    if (!!!isValid) {
      return this.displayFileUploadInstructions();
    }

    const firstFile = files[0];
    this.presetProperties(firstFile);

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

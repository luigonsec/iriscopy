import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss'],
})
export class PrintFormComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    const unaCara = {
      name: 'Una cara',
      code: 'una-cara',
      factor: 1,
      description: 'Por una cara del papel',
    };
    const dobleCara = {
      name: 'Doble cara',
      code: 'doble-cara',
      factor: 0.5,
      description: 'Por ambas caras del papel',
    };
    this.options = [unaCara, dobleCara];
    this.option = unaCara;
    this.emitChange.emit(this.option);
  }
}

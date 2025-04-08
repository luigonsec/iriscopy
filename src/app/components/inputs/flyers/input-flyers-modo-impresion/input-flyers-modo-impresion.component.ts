import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/flyers';

@Component({
  selector: 'app-input-flyers-modo-impresion',
  templateUrl: './input-flyers-modo-impresion.component.html',
  styleUrls: ['./input-flyers-modo-impresion.component.scss'],
})
export class InputFlyersModoImpresionComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    this.options = options.printForm;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

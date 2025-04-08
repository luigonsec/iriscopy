import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/tarjetas-visita';

@Component({
  selector: 'app-input-tarjetas-visita-modo-impresion',
  templateUrl: './input-tarjetas-visita-modo-impresion.component.html',
  styleUrls: ['./input-tarjetas-visita-modo-impresion.component.scss'],
})
export class InputTarjetasVisitaModoImpresionComponent implements OnInit {
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

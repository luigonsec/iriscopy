import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/tarjetas-visita';

@Component({
  selector: 'app-input-tarjetas-visita-tipo-acabado',
  templateUrl: './input-tarjetas-visita-tipo-acabado.component.html',
  styleUrls: ['./input-tarjetas-visita-tipo-acabado.component.scss'],
})
export class InputTarjetasVisitaTipoAcabadoComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    this.options = options.finishType;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

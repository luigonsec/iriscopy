import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-finish-type',
  templateUrl: './finish-type.component.html',
  styleUrls: ['./finish-type.component.scss'],
})
export class FinishTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  @Output() emitChange = new EventEmitter<any>();

  constructor() {}

  onSelect(event: { value: Option }) {
    this.emitChange.emit(event.value);
  }

  ngOnInit(): void {
    const sinAcabado = {
      name: 'Sin acabado',
      code: 'sin-acabado',
      description: 'Folios sueltos',
    };
    const grapado = {
      name: 'Grapado',
      code: 'grapado',
      description: 'En esquina',
    };
    const encuadernado = {
      name: 'Encuadernado',
      code: 'encuadernado',
      description: 'En espiral',
    };
    this.options = [sinAcabado, grapado, encuadernado];
    this.option = sinAcabado;
    this.emitChange.emit(this.option);
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  ngOnInit(): void {
    const vdi = {
      name: 'Vertical. Derecha-Izquierda',
      code: 'vertical-derecha-izquierda',
    };
    const haa = {
      name: 'Horizontal. Abajo-Arriba',
      code: 'horizontal-abajo-arriba',
    };
    const vaa = {
      name: 'Vertical. Abajo-Arriba',
      code: 'vertical-abajo-arriba',
    };
    const hdi = {
      name: 'Horizontal. Derecha-Izquierda',
      code: 'horizontal-derecha-izquierda',
    };
    this.options = [vdi, haa, vaa, hdi];
    this.option = vdi;
    this.emitChange.emit(this.option);
  }

  handleChange($event) {
    const orientation = $event.value;
    this.emitChange.emit(orientation);
  }
}

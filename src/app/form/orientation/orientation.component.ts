import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      {
        name: 'Vertical. Derecha-Izquierda',
        code: 'vertical-derecha-izquierda',
      },
      { name: 'Horizontal. Abajo-Arriba', code: 'horizontal-abajo-arriba' },
      { name: 'Vertical. Abajo-Arriba', code: 'vertical-abajo-arriba' },
      {
        name: 'Horizontal. Derecha-Izquierda',
        code: 'horizontal-derecha-izquierda',
      },
    ];
  }

  ngOnInit(): void {}
}

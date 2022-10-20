import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-finish-type',
  templateUrl: './finish-type.component.html',
  styleUrls: ['./finish-type.component.scss'],
})
export class FinishTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      {
        name: 'Sin acabado',
        code: 'sin-acabado',
      },
      { name: 'Grapado', code: 'grapado' },
      {
        name: 'Encuadernado',
        code: 'encuadernado',
      },
    ];
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-bound-type',
  templateUrl: './bound-type.component.html',
  styleUrls: ['./bound-type.component.scss'],
})
export class BoundTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    const individual = {
      name: 'Individualmente',
      code: 'individual',
      description: 'Por cada documento',
    };
    const agrupados = {
      name: 'Agrupados',
      code: 'agrupados',
      description: 'Todos en uno',
    };

    this.options = [individual, agrupados];
    this.option = individual;
  }

  ngOnInit(): void {}
}

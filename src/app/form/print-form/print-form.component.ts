import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss'],
})
export class PrintFormComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {}

  ngOnInit(): void {
    const unaCara = {
      name: 'Una cara',
      code: 'una-cara',
      description: 'Por una cara del papel',
    };
    const dobleCara = {
      name: 'Doble cara',
      code: 'doble-cara',
      description: 'Por ambas caras del papel',
    };
    this.options = [unaCara, dobleCara];
    this.option = unaCara;
  }
}

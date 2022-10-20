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

  constructor() {
    this.options = [
      { name: 'Una cara', code: 'una-cara' },
      { name: 'Doble cara', code: 'doble-cara' },
    ];
  }

  ngOnInit(): void {}
}

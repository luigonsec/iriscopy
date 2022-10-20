import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-print-type',
  templateUrl: './print-type.component.html',
  styleUrls: ['./print-type.component.scss'],
})
export class PrintTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      { name: 'Blanco y negro', code: 'blanco-negro' },
      { name: 'Color', code: 'color' },
    ];
  }

  ngOnInit(): void {}
}

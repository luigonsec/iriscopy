import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-paper-size',
  templateUrl: './paper-size.component.html',
  styleUrls: ['./paper-size.component.scss'],
})
export class PaperSizeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      { name: 'A3', code: 'A3' },
      { name: 'A4', code: 'A4' },
      { name: 'A5', code: 'A5' },
    ];
  }

  ngOnInit(): void {}
}

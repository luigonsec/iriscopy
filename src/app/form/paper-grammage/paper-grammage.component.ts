import { Component, OnInit } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-paper-grammage',
  templateUrl: './paper-grammage.component.html',
  styleUrls: ['./paper-grammage.component.scss'],
})
export class PaperGrammageComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  constructor() {
    this.options = [
      { name: '80gr', code: '80gr' },
      { name: '100gr', code: '100gr' },
    ];
  }

  ngOnInit(): void {}
}

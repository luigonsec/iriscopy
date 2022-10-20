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

  constructor() {}

  ngOnInit(): void {
    const gr80 = { name: '80gr', code: '80gr', description: 'Navigator' };
    const gr100 = { name: '100gr', code: '100gr', description: 'Navigator' };
    this.options = [gr80, gr100];
    this.option = gr80;
  }
}

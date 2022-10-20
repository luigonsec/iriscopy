import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-paper-grammage',
  templateUrl: './paper-grammage.component.html',
  styleUrls: ['./paper-grammage.component.scss'],
})
export class PaperGrammageComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const paperGrammage = $event.value;
    this.emitChange.emit(paperGrammage);
  }
  ngOnInit(): void {
    const gr80 = { name: '80gr', code: '80gr', description: 'Navigator' };
    const gr100 = { name: '100gr', code: '100gr', description: 'Navigator' };
    this.options = [gr80, gr100];
    this.option = gr80;
    this.emitChange.emit(this.option);
  }
}

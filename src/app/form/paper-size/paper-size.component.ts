import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-paper-size',
  templateUrl: './paper-size.component.html',
  styleUrls: ['./paper-size.component.scss'],
})
export class PaperSizeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    const A3 = { name: 'A3', code: 'A3' };
    const A4 = { name: 'A4', code: 'A4' };

    this.options = [A3, A4];
    this.option = A4;
    this.emitChange.emit(this.option);
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
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
    const paperSize = $event.value;
    this.emitChange.emit(paperSize);
  }

  ngOnInit(): void {
    this.options = options.paperSize;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

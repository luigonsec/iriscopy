import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-finish-type',
  templateUrl: './finish-type.component.html',
  styleUrls: ['./finish-type.component.scss'],
})
export class FinishTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;

  @Output() emitChange = new EventEmitter<any>();

  constructor() {}

  onSelect(event: { value: Option }) {
    this.emitChange.emit(event.value);
  }

  ngOnInit(): void {
    this.options = options.finishType;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
@Component({
  selector: 'app-bound-type',
  templateUrl: './bound-type.component.html',
  styleUrls: ['./bound-type.component.scss'],
})
export class BoundTypeComponent implements OnInit {
  public options: Option[];
  public option: Option;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    this.options = options.boundTypes;
    this.option = this.option || options.boundTypes.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

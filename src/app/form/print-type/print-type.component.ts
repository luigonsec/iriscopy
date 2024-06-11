import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-print-type',
  templateUrl: './print-type.component.html',
  styleUrls: ['./print-type.component.scss'],
})
export class PrintTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  private _paperType: any;

  @Output() emitChange = new EventEmitter<Option>();

  @Input() set paperType(value: any) {
    this._paperType = value;
    const filteredOptions = options.printType.filter((x) => {
      return !(x.code === 'color' && this._paperType.code === 'fotografico');
    });

    if (
      this._paperType.code === 'fotografico' &&
      this.option.code === 'color'
    ) {
      this.option = filteredOptions.find((x) => x.default);
      this.emitChange.emit(this.option);
    }

    this.options = filteredOptions;
  }

  constructor() {}

  handleChange($event) {
    const printForm = $event.value;
    this.emitChange.emit(printForm);
  }

  ngOnInit(): void {
    this.options = options.printType;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

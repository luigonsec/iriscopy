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
  private _paperGrammage: any;

  @Output() emitChange = new EventEmitter<Option>();

  @Input() set paperGrammage(value: any) {
    this._paperGrammage = value;
    const filteredOptions = options.printType.filter((x) => {
      return !(
        x.code === 'color' && this._paperGrammage.code === 'fotografico'
      );
    });

    if (
      this._paperGrammage.code === 'fotografico' &&
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

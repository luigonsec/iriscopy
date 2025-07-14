import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/tarjetas-visita';

@Component({
    selector: 'app-print-form',
    templateUrl: './print-form.component.html',
    styleUrls: ['./print-form.component.scss'],
    standalone: false
})
export class PrintFormComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  private _paperType: any;
  @Output() emitChange = new EventEmitter<Option>();

  @Input() set paperType(value: any) {
    this._paperType = value;
    const filteredOptions = options.printForm.filter((x) => {
      return !(
        x.code === 'doble-cara' && this._paperType.code === 'fotografico'
      );
    });

    if (
      this._paperType.code === 'fotografico' &&
      this.option.code === 'doble-cara'
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
    this.options = options.printForm;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

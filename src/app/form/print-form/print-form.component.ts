import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss'],
})
export class PrintFormComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  private _paperGrammage: any;
  @Output() emitChange = new EventEmitter<Option>();

  @Input() set paperGrammage(value: any) {
    this._paperGrammage = value;
    const filteredOptions = options.printForm.filter((x) => {
      return !(
        x.code === 'doble-cara' && this._paperGrammage.code === 'fotografico'
      );
    });

    if (
      this._paperGrammage.code === 'fotografico' &&
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

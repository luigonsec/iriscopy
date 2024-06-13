import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-finish-type',
  templateUrl: './finish-type.component.html',
  styleUrls: ['./finish-type.component.scss'],
})
export class FinishTypeComponent implements OnInit {
  public optionsGroup1: Option[];
  public optionsGroup2: Option[];
  public option: Option = undefined;
  private _paperSize: any;

  @Output() emitChange = new EventEmitter<any>();
  @Input() set paperSize(value: any) {
    this._paperSize = value;
    const filteredOptions = options.finishType.filter((x) => {
      return !(x.code === 'encuadernado' && this._paperSize.code === 'A3');
    });

    if (this._paperSize.code === 'A3' && this.option.code === 'encuadernado') {
      this.option = filteredOptions.find((x) => x.default);
      this.emitChange.emit(this.option);
    }

    // Dividir en dos grupos
    const half = Math.ceil(filteredOptions.length / 2);
    this.optionsGroup1 = filteredOptions.slice(0, half);
    this.optionsGroup2 = filteredOptions.slice(half);
  }

  constructor() {}

  onSelect(event: { value: Option }) {
    this.emitChange.emit(event.value);
  }

  ngOnInit(): void {
    const filteredOptions = options.finishType;
    const half = Math.ceil(filteredOptions.length / 2);
    this.optionsGroup1 = filteredOptions.slice(0, half);
    this.optionsGroup2 = filteredOptions.slice(half);
    this.option = filteredOptions.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

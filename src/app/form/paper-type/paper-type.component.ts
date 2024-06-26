import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-paper-type',
  templateUrl: './paper-type.component.html',
  styleUrls: ['./paper-type.component.scss'],
})
export class PaperTypeComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  private _paperSize;

  @Output() emitChange = new EventEmitter<Option>();
  @Input() set paperSize(value) {
    this._paperSize = value;
    const filteredOptions = options.paperType.filter((x) => {
      return !(x.code === 'fotografico' && this._paperSize.code === 'A3');
    });

    if (this._paperSize.code === 'A3' && this.option.code === 'fotografico') {
      this.option = filteredOptions.find((x) => x.default);
      this.emitChange.emit(this.option);
    }

    this.options = filteredOptions;
  }

  constructor() {}

  handleChange($event) {
    const paperType = $event.value;
    this.emitChange.emit(paperType);
  }

  ngOnInit(): void {
    this.options = options.paperType;
    this.option = options.paperType.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

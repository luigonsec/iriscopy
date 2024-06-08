import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-paper-grammage',
  templateUrl: './paper-grammage.component.html',
  styleUrls: ['./paper-grammage.component.scss'],
})
export class PaperGrammageComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  private _paperSize: any;

  @Output() emitChange = new EventEmitter<Option>();
  @Input() set paperSize(value: any) {
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
    const paperGrammage = $event.value;
    this.emitChange.emit(paperGrammage);
  }
  ngOnInit(): void {
    this.options = options.paperType;
    this.option = options.paperType.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

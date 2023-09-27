import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  private _paperSize: any;

  @Output() emitChange = new EventEmitter<any>();
  @Input() set paperSize(value: any) {
    this._paperSize = value;
    this.options = options.finishType.filter((x) => {
      return !(x.code === 'encuadernado' && this._paperSize.code === 'A3');
    });

    if (this._paperSize.code === 'A3' && this.option.code === 'encuadernado') {
      this.option = this.options.find((x) => x.default);
      this.emitChange.emit(this.option);
    }
  }

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

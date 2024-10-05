import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import File from 'src/app/interfaces/File';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
@Component({
  selector: 'app-bound-type',
  templateUrl: './bound-type.component.html',
  styleUrls: ['./bound-type.component.scss'],
})
export class BoundTypeComponent implements OnInit {
  public options: Option[];
  private _files: File[];

  @Input() public option: Option = options.boundTypes.find((x) => x.default);
  @Output() emitChange = new EventEmitter<Option>();
  @Input('files') set files(value) {
    this._files = value || [];
    const _files = this._files;
    const filteredOptions = options.boundTypes.filter((x) => {
      return !(x.code === 'agrupados' && _files.length == 1);
    });

    if (this._files.length === 1 && this.option.code === 'agrupados') {
      this.option = filteredOptions.find((x) => x.default);
      this.emitChange.emit(this.option);
    }
    this.options = filteredOptions;
  }

  constructor() {}

  handleChange($event) {
    const boundType = $event.value;
    this.emitChange.emit(boundType);
  }

  ngOnInit(): void {
    this.options = options.boundTypes.filter((x) => {
      if (!!!this._files || this._files.length == 0) return true;
      return !(x.code === 'agrupados' && this._files.length == 1);
    });
    this.option = this.option || options.boundTypes.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

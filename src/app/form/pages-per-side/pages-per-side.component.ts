import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-pages-per-side',
  templateUrl: './pages-per-side.component.html',
  styleUrls: ['./pages-per-side.component.scss'],
})
export class PagesPerSideComponent implements OnInit {
  public options: Option[];
  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  public _orientation: Option;
  @Input() set orientation(value) {
    this._orientation = value;
    this.setValues();
  }

  constructor() {}

  handleChange($event) {
    const pagesPerSide = $event.value;
    this.emitChange.emit(pagesPerSide);
  }

  setValues() {
    const orientationCode = this._orientation.code.includes('vertical')
      ? 'vertical'
      : 'horizontal';
    const filteredOptions = options.pagesPerSide.filter((x) => {
      return x.code.includes(orientationCode);
    });

    this.option = filteredOptions.find((x) => x.default);
    this.emitChange.emit(this.option);
    this.options = filteredOptions;
  }

  ngOnInit(): void {
    this.setValues();
    this.emitChange.emit(this.option);
  }
}

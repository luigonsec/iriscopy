import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  constructor() {}

  handleChange($event) {
    const pagesPerSide = $event.value;
    this.emitChange.emit(pagesPerSide);
  }

  ngOnInit(): void {
    this.options = options.pagesPerSide;
    this.option = this.options.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

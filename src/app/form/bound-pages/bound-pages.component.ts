import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
@Component({
    selector: 'app-bound-pages',
    templateUrl: './bound-pages.component.html',
    styleUrls: ['./bound-pages.component.scss'],
    standalone: false
})
export class BoundPagesComponent implements OnInit {
  public options: Option[];
  @Input() public option: Option;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const boundPages = $event.value;
    this.emitChange.emit(boundPages);
  }

  ngOnInit(): void {
    this.options = options.boundPages;
    this.option = this.option || options.boundPages.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

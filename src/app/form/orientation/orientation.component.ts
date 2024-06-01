import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent implements OnInit {
  public optionsGroup1: Option[];
  public optionsGroup2: Option[];

  public option: Option = undefined;
  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  ngOnInit(): void {
    this.optionsGroup1 = options.orientation.slice(0, 2);
    this.optionsGroup2 = options.orientation.slice(2, 4);
    this.option = options.orientation.find((x) => x.default);
    this.emitChange.emit(this.option);
  }

  handleChange($event) {
    const orientation = $event.value;
    this.emitChange.emit(orientation);
    console.log(this.option, orientation);
  }
}

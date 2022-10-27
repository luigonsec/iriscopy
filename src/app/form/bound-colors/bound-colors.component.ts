import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import BoundColor from 'src/app/interfaces/BoundColor';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';

@Component({
  selector: 'app-bound-colors',
  templateUrl: './bound-colors.component.html',
  styleUrls: ['./bound-colors.component.scss'],
})
export class BoundColorsComponent implements OnInit {
  public bounds: Option[];
  public option: Option;
  @Output() emitChange = new EventEmitter<any>();

  public colorsCover: BoundColor[];
  public colorsRings: BoundColor[];

  @Input() public colorActive: {
    delantera?: BoundColor;
    trasera?: BoundColor;
    anillas?: BoundColor;
  };

  constructor() {}

  ngOnInit(): void {
    this.colorsRings = options.colorsRings;
    this.colorsCover = options.colorsCover;
    this.bounds = options.bounds;
    this.option = this.bounds.find((x) => x.default) || this.bounds[0];

    this.colorActive = this.colorActive || {
      delantera: this.colorsCover.find((x) => x.default),
      trasera: this.colorsCover.find((x) => x.default),
      anillas: this.colorsRings.find((x) => x.default),
    };

    this.emitChange.emit(this.colorActive);
  }

  colorDelantera($event) {
    this.colorActive.delantera = $event;
    this.emitChange.emit(this.colorActive);
  }
  colorTrasera($event) {
    this.colorActive.trasera = $event;
    this.emitChange.emit(this.colorActive);
  }
  colorAnillas($event) {
    this.colorActive.anillas = $event;
    this.emitChange.emit(this.colorActive);
  }
}

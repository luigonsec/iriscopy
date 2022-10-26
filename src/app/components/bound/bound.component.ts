import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import BoundColor from 'src/app/interfaces/BoundColor';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
interface Bound {
  boundType: Option;
  boundColors: {
    delantera: BoundColor;
    anillas: BoundColor;
    trasera: BoundColor;
  };
}

@Component({
  selector: 'app-bound',
  templateUrl: './bound.component.html',
  styleUrls: ['./bound.component.scss'],
})
export class BoundComponent implements OnInit {
  public boundColors: {
    delantera: BoundColor;
    anillas: BoundColor;
    trasera: BoundColor;
  };
  public boundType: Option;

  public bound = {
    boundType: options.boundTypes.find((x) => x.default),
    boundColors: {
      anillas: options.colorsRings.find((x) => x.default),
      trasera: options.colorsRings.find((x) => x.default),
      delantera: options.colorsRings.find((x) => x.default),
    },
  };

  @Output() emitChangeBound = new EventEmitter<Bound>();

  constructor() {}

  handleBoundType(value) {
    this.bound.boundType = value;
    this.emitChangeBound.emit(this.bound);
  }

  handleBoundColors(value) {
    this.bound.boundColors = value;
    this.emitChangeBound.emit(this.bound);
  }

  ngOnInit(): void {
    this.emitChangeBound.emit(this.bound);
  }
}

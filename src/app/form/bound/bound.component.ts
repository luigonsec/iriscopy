import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import BoundColor from 'src/app/interfaces/BoundColor';
import Option from 'src/app/interfaces/Option';
import RingColor from 'src/app/interfaces/RingColor';
import options from 'src/config/options';
interface Bound {
  boundPages: Option;
  boundType: Option;
  boundColors: {
    anillas: RingColor;
    delantera: BoundColor;
    trasera: BoundColor;
  };
}

@Component({
  selector: 'app-bound',
  templateUrl: './bound.component.html',
  styleUrls: ['./bound.component.scss'],
})
export class BoundComponent implements OnInit {
  @Input() public boundColors: {
    anillas: RingColor;
    delantera: BoundColor;
    trasera: BoundColor;
  };
  @Input() public boundType: Option;
  @Input() public boundPages: Option;

  public bound = {
    boundPages: options.boundPages.find((x) => x.default),
    boundType: options.boundTypes.find((x) => x.default),
    boundColors: {
      anillas: options.colorsRings.find((x) => x.default),
      trasera: options.colorsCover.find((x) => x.default),
      delantera: options.colorsCover.find((x) => x.default),
    },
  };

  @Output() emitChangeBound = new EventEmitter<Bound>();

  constructor() {}

  handleBoundType(value) {
    this.bound.boundType = value;
    this.emitChangeBound.emit(this.bound);
  }

  handleBoundPages(value) {
    this.bound.boundPages = value;
    this.emitChangeBound.emit(this.bound);
  }

  handleBoundColors(value) {
    this.bound.boundColors = value;
    this.emitChangeBound.emit(this.bound);
  }

  ngOnInit(): void {
    // this.emitChangeBound.emit(this.bound);
  }
}

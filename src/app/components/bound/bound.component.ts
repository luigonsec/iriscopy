import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-bound',
  templateUrl: './bound.component.html',
  styleUrls: ['./bound.component.scss'],
})
export class BoundComponent implements OnInit {
  @Input() boundColors: {
    delantera: { id: number; color: string; name: string };
    anillas: { id: number; color: string; name: string };
    trasera: { id: number; color: string; name: string };
  };
  @Input() boundType: Option;

  @Output() emitChangeBoundType = new EventEmitter<Option>();
  @Output() emitChangeBoundColors = new EventEmitter<{
    delantera: { id: number; color: string; name: string };
    anillas: { id: number; color: string; name: string };
    trasera: { id: number; color: string; name: string };
  }>();

  constructor() {}

  handleBoundType(value) {
    const boundType = value;
    this.emitChangeBoundType.emit(boundType);
  }

  handleBoundColors(value) {
    const boundColors = value;
    this.emitChangeBoundColors.emit(boundColors);
  }

  ngOnInit(): void {}
}

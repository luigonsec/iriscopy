import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-bound-colors',
  templateUrl: './bound-colors.component.html',
  styleUrls: ['./bound-colors.component.scss'],
})
export class BoundColorsComponent implements OnInit {
  public options: Option[];
  public option: Option;
  @Output() emitChange = new EventEmitter<any>();

  public colorsCover: { id: number; color: string; name: string }[];
  public colorsRings: { id: number; color: string; name: string }[];

  @Input() public colorActive: {
    delantera?: string;
    trasera?: string;
    anillas?: string;
  };

  constructor() {}

  ngOnInit(): void {
    this.colorsRings = [
      {
        id: 1,
        color:
          'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
        name: 'Transparente',
      },
      { id: 2, color: 'white', name: 'Blanco' },
      { id: 3, color: 'black', name: 'Negro' },
      { id: 4, color: '#40e0d0', name: 'Turquesa' },
      { id: 5, color: '#ffc0cb', name: 'Rosa pastel' },
      { id: 6, color: '#9370db', name: 'Lila pastel' },
      { id: 7, color: '#87cefa', name: 'Azul pastel' },
      { id: 8, color: '#ffa500', name: 'Naranja pastel' },
      { id: 9, color: '#ffff00', name: 'Amarillo pastel' },
      { id: 10, color: '#bdecb6', name: 'Verde pastel' },
      { id: 11, color: '#ff6961', name: 'Rojo' },
    ];

    this.colorsCover = [
      {
        id: 1,
        color:
          'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
        name: 'Transparente',
      },
      { id: 2, color: 'black', name: 'Negro' },
      { id: 3, color: '#40e0d0', name: 'Turquesa' },
      { id: 4, color: '#ffc0cb', name: 'Rosa pastel' },
      { id: 5, color: '#9370db', name: 'Lila pastel' },
      { id: 6, color: '#87cefa', name: 'Azul pastel' },
      { id: 7, color: '#ffa500', name: 'Naranja pastel' },
      { id: 8, color: '#ffff00', name: 'Amarillo pastel' },
      { id: 9, color: '#ff6961', name: 'Rojo' },
    ];

    this.options = [
      { name: 'Anillas', code: 'anillas' },
      { name: 'Tapa delantera', code: 'tapa-delantera' },
      { name: 'Tapa trasera', code: 'tapa-trasera' },
    ];

    this.option = this.options[0];

    this.colorActive = this.colorActive || {
      delantera: undefined,
      trasera: undefined,
      anillas: undefined,
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

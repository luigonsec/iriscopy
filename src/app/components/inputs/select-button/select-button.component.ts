import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import Option from 'src/app/interfaces/Option';

@Component({
  selector: 'app-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SelectButtonComponent implements OnInit {
  @Input('options') public options: Option[];
  @Input('allowDeselect') public allowDeselect: boolean = false; // Por defecto no se permite deseleccionar
  public option: Option = undefined;
  public groups: string[] = [];
  public optionsByGroup: { [key: string]: Option[] } = {};
  public disabled = false;
  private previousOption: Option = undefined; // Para mantener la opción anterior

  @Output() emitChange = new EventEmitter<Option>();

  constructor() {}

  handleChange($event) {
    const option = $event.value;

    // Si no se permite deselección y la opción es null/undefined, restaurar la opción anterior
    if (!this.allowDeselect && (option === null || option === undefined)) {
      // Restaurar la opción anterior en el modelo
      setTimeout(() => {
        this.option = this.previousOption;
      }, 0);
      return;
    }

    // Guardar la opción actual como anterior antes de cambiar
    this.previousOption = this.option;
    this.option = option;
    this.emitChange.emit(option);
  }

  setUpOption(option: Option) {
    this.previousOption = this.option; // Guardar la opción anterior
    this.option = option;
    this.emitChange.emit(this.option);
  }

  /**
   * Fuerza la selección de una opción sin posibilidad de deselección
   */
  forceSelection(option: Option) {
    this.previousOption = option;
    this.option = option;
    this.emitChange.emit(this.option);
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  ngOnInit(): void {
    this.option = this.options.find((x) => x.default);
    this.previousOption = this.option; // Inicializar la opción anterior
    this.groups = [...new Set(this.options.map((x) => x.group))];
    this.groups.forEach((group) => {
      this.optionsByGroup[group] = this.options.filter(
        (x) => x.group === group
      );
    });
    this.emitChange.emit(this.option);
  }
}

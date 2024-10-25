import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import Option from 'src/app/interfaces/Option';
import options from 'src/config/options';
import { OverlayPanel } from 'primeng/overlaypanel';
import File from 'src/app/interfaces/File';

@Component({
  selector: 'app-finish-type',
  templateUrl: './finish-type.component.html',
  styleUrls: ['./finish-type.component.scss'],
})
export class FinishTypeComponent implements OnInit {
  public optionsGroup1: Option[];
  public optionsGroup2: Option[];
  public option: Option = undefined;
  private _paperSize: any;
  private _files: File[] = [];
  private _printForm: Option;
  private _pagesPerSide: Option;

  public overlayVisible = false;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;

  @Output() emitChange = new EventEmitter<any>();
  @Input() set printForm(value: any) {
    this._printForm = value;
    this.manageOptions();
  }
  @Input() set files(value: any) {
    this._files = value || [];
    this.manageOptions();
  }

  @Input() set pagesPerSide(value: any) {
    this._pagesPerSide = value;
    this.manageOptions();
  }
  @Input() set paperSize(value: any) {
    this._paperSize = value;
    this.manageOptions();
  }

  constructor() {}

  manageOptions() {
    const isInvalidGrapado = this._files
      .map((file) =>
        Math.ceil(
          file.pages * this._pagesPerSide.factor * this._printForm.factor
        )
      )
      .some((pages) => pages > 50);

    const isValidOption = (option) => {
      const isInvalidEncuadernado =
        option.code === 'encuadernado' && this._paperSize.code === 'A3';
      const isInvalidGrapadoOption =
        option.code === 'grapado' && isInvalidGrapado;
      return !(isInvalidEncuadernado || isInvalidGrapadoOption);
    };

    const filteredOptions = options.finishType.filter(isValidOption);

    const resetOptionIfInvalid = (condition) => {
      if (condition) {
        this.option = filteredOptions.find((option) => option.default);
        this.emitChange.emit(this.option);
      }
    };

    resetOptionIfInvalid(
      this._paperSize.code === 'A3' && this.option.code === 'encuadernado'
    );
    resetOptionIfInvalid(isInvalidGrapado && this.option.code === 'grapado');

    // Dividir en dos grupos
    const half = Math.ceil(filteredOptions.length / 2);
    this.optionsGroup1 = filteredOptions.slice(0, half);
    this.optionsGroup2 = filteredOptions.slice(half);
  }

  onSelect(event: { value: Option }) {
    this.emitChange.emit(event.value);
  }

  showOverlay($event) {
    $event.stopPropagation();
    this.overlayPanel.show($event);
  }

  ngOnInit(): void {
    const filteredOptions = options.finishType;
    const half = Math.ceil(filteredOptions.length / 2);
    this.optionsGroup1 = filteredOptions.slice(0, half);
    this.optionsGroup2 = filteredOptions.slice(half);
    this.option = filteredOptions.find((x) => x.default);
    this.emitChange.emit(this.option);
  }
}

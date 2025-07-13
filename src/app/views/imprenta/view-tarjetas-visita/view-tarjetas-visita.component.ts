import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
import tarjetaVisitaOptions from 'src/config/tarjetas-visita';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { firstValueFrom } from 'rxjs';
import { ShopcartService } from '../../../services/shopcart.service';
import File from '../../../interfaces/File';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';

// Constantes para la validación de tarjetas de visita
const BUSINESS_CARD_CONSTRAINTS = {
  DIMENSIONS: {
    WIDTH: 91,
    HEIGHT: 61,
  },
  PAGES: {
    MIN: 1,
    MAX: 2,
  },
} as const;

// Tipos para el resultado de validación
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  type: 'pages' | 'dimensions';
  message: string;
  expected?: any;
  actual?: any;
}
@Component({
  selector: 'app-view-tarjetas-visita',
  templateUrl: './view-tarjetas-visita.component.html',
  styleUrls: ['./view-tarjetas-visita.component.scss'],
})
export class ViewTarjetasVisitaComponent
  extends FormBase<TarjetaVisita>
  implements OnInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('printFormSelector')
  public printFormSelector: SelectButtonComponent;
  public tarjetaVisitaOptions = tarjetaVisitaOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();
  }

  updateReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(
      this.pricesService.getBusinessCardPrice(this.order)
    );
  };

  addToCartFn = async (order: TarjetaVisita) => {
    return this.shopCart.addBusinessCardToCart.bind(this.shopCart)(order);
  };

  /**
   * Valida las dimensiones de un archivo para tarjetas de visita
   * @param file Archivo a validar
   * @returns Resultado de la validación con errores específicos
   */
  private validateFileConstraints(file: File): ValidationResult {
    const errors: ValidationError[] = [];

    // Validar número de páginas
    if (!this.isValidPageCount(file.pages)) {
      errors.push({
        type: 'pages',
        message: `El archivo debe tener entre ${BUSINESS_CARD_CONSTRAINTS.PAGES.MIN} y ${BUSINESS_CARD_CONSTRAINTS.PAGES.MAX} páginas`,
        expected: `${BUSINESS_CARD_CONSTRAINTS.PAGES.MIN}-${BUSINESS_CARD_CONSTRAINTS.PAGES.MAX}`,
        actual: file.pages,
      });
    }

    // Validar dimensiones de las páginas
    const invalidDimensions = this.findInvalidDimensions(file.pageDimensions);
    if (invalidDimensions.length > 0) {
      errors.push({
        type: 'dimensions',
        message: `Las páginas deben medir ${BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.WIDTH}x${BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.HEIGHT}mm`,
        expected: `${BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.WIDTH}x${BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.HEIGHT}mm`,
        actual: invalidDimensions
          .map((d) => `${d.width}x${d.height}mm`)
          .join(', '),
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Verifica si el número de páginas es válido
   */
  private isValidPageCount(pages: number): boolean {
    return (
      pages >= BUSINESS_CARD_CONSTRAINTS.PAGES.MIN &&
      pages <= BUSINESS_CARD_CONSTRAINTS.PAGES.MAX
    );
  }

  /**
   * Encuentra las dimensiones que no cumplen con los requisitos
   */
  private findInvalidDimensions(
    pageDimensions: Array<{ width: number; height: number }>
  ): Array<{ width: number; height: number }> {
    return pageDimensions.filter(
      (dimension) =>
        dimension.width !== BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.WIDTH ||
        dimension.height !== BUSINESS_CARD_CONSTRAINTS.DIMENSIONS.HEIGHT
    );
  }

  /**
   * Maneja los errores de validación mostrando mensajes específicos al usuario
   */
  private handleValidationErrors(errors: ValidationError[]): void {
    const errorMessages = errors.map((error) => error.message).join('.\n');

    this.messageService.add({
      severity: 'error',
      summary: 'Archivo no válido',
      detail: errorMessages,
      life: 5000,
    });
  }

  /**
   * Función principal de validación que combina validación y manejo de errores
   * @param files Array de archivos a validar
   * @returns true si todos los archivos son válidos, false en caso contrario
   */
  public validateFiles(files: File[]): boolean {
    if (!files || files.length === 0) {
      return false;
    }

    const file = files[0];
    const validationResult = this.validateFileConstraints(file);

    if (!validationResult.isValid) {
      this.handleValidationErrors(validationResult.errors);
      this.uploader.removeFile(file);
      return false;
    }

    return true;
  }

  public presetProperties(file: File): void {
    const code = file.pages == 1 ? 'una-cara' : 'doble-cara';
    const printFormOption = this.tarjetaVisitaOptions.printForm.find(
      (x) => x.code === code
    );
    this.printFormSelector.setUpOption(printFormOption);
    this.printFormSelector.disable();
  }

  undoPresetProperties() {
    this.printFormSelector.enable();
  }

  ngOnInit() {
    this.order = {
      finishType: undefined,
      printForm: undefined,
      paperType: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
    super.ngOnInit();
  }
}

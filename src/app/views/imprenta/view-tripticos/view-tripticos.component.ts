import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import tripricoOptions from 'src/config/tripticos';
import Triptico from '../../../interfaces/Triptico';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';
@Component({
  selector: 'app-view-tripticos',
  templateUrl: './view-tripticos.component.html',
  styleUrls: ['./view-tripticos.component.scss'],
  standalone: false,
})
export class ViewTripticosComponent
  extends FormBase<Triptico>
  implements OnInit, AfterViewInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('formatSelector') public formatSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;
  public tripricoOptions = tripricoOptions;

  // Variables para almacenar la configuración automática
  private detectedOrientationCode: string;
  private detectedPaperSize: any;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();

    // Configurar el validador y el servicio de mensajes
    this.setFileValidator(
      FileValidatorFactory.createTripticoValidator(tripricoOptions)
    );
    this.setMessageService(messageService);
  }

  updateReady() {
    let res = true;

    if (!this.order.paperType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(
      this.pricesService.getTriptychPrice(this.order)
    );
  };

  addToCartFn = async (order: Triptico) => {
    return this.shopCart.addTritychToCart.bind(this.shopCart)(order);
  };

  /**
   * Configura automáticamente la orientación basada en las dimensiones del archivo
   */
  protected setDetectedOrientation(orientation: string): void {
    this.detectedOrientationCode = orientation;

    const formatOption = this.tripricoOptions.format.find(
      (option) => option.code === orientation
    );

    if (formatOption) {
      // Actualizar el orden inmediatamente
      this.order.format = formatOption;
      this.order = Object.assign({}, this.order);

      // Configurar el selector si está disponible
      if (this.formatSelector) {
        this.formatSelector.setUpOption(formatOption);
        this.formatSelector.disable();
      }

      // Activar detección de cambios para mostrar el selector de tamaño correcto
      setTimeout(() => {
        this.applyPaperSizeIfDetected();
      }, 0);
    }
  }

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    this.detectedPaperSize = paperSize;
    this.applyPaperSizeIfDetected();
  }

  /**
   * Aplica la configuración de tamaño si está disponible y el selector está listo
   */
  private applyPaperSizeIfDetected(): void {
    if (this.detectedPaperSize && this.paperSizeSelector) {
      // Actualizar el orden inmediatamente
      this.order.paperSize = this.detectedPaperSize;
      this.order = Object.assign({}, this.order);

      // Configurar el selector
      this.paperSizeSelector.setUpOption(this.detectedPaperSize);
      this.paperSizeSelector.disable();
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
    // Limpiar las variables de detección
    this.detectedOrientationCode = undefined;
    this.detectedPaperSize = undefined;

    // Habilitar los selectores
    if (this.formatSelector) {
      this.formatSelector.enable();
    }
    if (this.paperSizeSelector) {
      this.paperSizeSelector.enable();
    }
  }

  ngOnInit() {
    this.order = {
      format: undefined,
      paperType: undefined,
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
    super.ngOnInit();
  }

  ngAfterViewInit() {
    // Aplicar configuración automática si ya fue detectada
    if (this.detectedOrientationCode && this.formatSelector) {
      const formatOption = this.tripricoOptions.format.find(
        (option) => option.code === this.detectedOrientationCode
      );
      if (formatOption) {
        this.formatSelector.setUpOption(formatOption);
        this.formatSelector.disable();
      }
    }

    // Aplicar configuración de tamaño si ya fue detectada
    setTimeout(() => {
      this.applyPaperSizeIfDetected();
    }, 0);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
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
    standalone: false
})
export class ViewTripticosComponent
  extends FormBase<Triptico>
  implements OnInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('formatSelector') public formatSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;
  public tripricoOptions = tripricoOptions;

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
    const formatOption = this.tripricoOptions.format.find(
      (option) => option.code === orientation
    );

    if (formatOption && this.formatSelector) {
      this.formatSelector.setUpOption(formatOption);
      this.formatSelector.disable();
    }
  }

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    if (this.paperSizeSelector) {
      this.paperSizeSelector.setUpOption(paperSize);
      this.paperSizeSelector.disable();
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
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
}

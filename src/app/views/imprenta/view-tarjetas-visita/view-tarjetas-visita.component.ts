import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
import tarjetaVisitaOptions from 'src/config/tarjetas-visita';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { firstValueFrom } from 'rxjs';
import { ShopcartService } from '../../../services/shopcart.service';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';
import { FileValidatorFactory } from '../../../_helpers/file-validator';

// Eliminamos las constantes y tipos locales ya que ahora usamos el sistema genérico
@Component({
    selector: 'app-view-tarjetas-visita',
    templateUrl: './view-tarjetas-visita.component.html',
    styleUrls: ['./view-tarjetas-visita.component.scss'],
    standalone: false
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

    // Configurar el validador y el servicio de mensajes
    this.setFileValidator(
      FileValidatorFactory.createTarjetaVisitaValidator(tarjetaVisitaOptions)
    );
    this.setMessageService(messageService);
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
   * Configura automáticamente el printForm basado en el número de páginas
   */
  protected setRecommendedPrintForm(printFormCode: string): void {
    const printFormOption = this.tarjetaVisitaOptions.printForm.find(
      (option) => option.code === printFormCode
    );

    if (printFormOption && this.printFormSelector) {
      this.printFormSelector.setUpOption(printFormOption);
      this.printFormSelector.disable();
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
    if (this.printFormSelector) {
      this.printFormSelector.enable();
    }
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

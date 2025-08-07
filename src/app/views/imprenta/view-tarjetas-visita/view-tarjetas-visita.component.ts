import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import TarjetaVisita from '../../../interfaces/TarjetaVisita';
import Option from '../../../interfaces/Option';
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
  standalone: false,
})
export class ViewTarjetasVisitaComponent
  extends FormBase<TarjetaVisita>
  implements OnInit
{
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('printFormSelector')
  public printFormSelector: SelectButtonComponent;
  @ViewChild('paperCategorySelector')
  public paperCategorySelector: SelectButtonComponent;
  @ViewChild('paperTypeSelector')
  public paperTypeSelector: SelectButtonComponent;

  public tarjetaVisitaOptions = tarjetaVisitaOptions;
  public paperTypeOptions: Option[] = [];

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

    if (!this.order.paperCategory) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  /**
   * Maneja el cambio de categoría de papel y actualiza las opciones disponibles
   */
  onPaperCategoryChange(category: any) {
    if (category && category.code) {
      this.paperTypeOptions =
        this.tarjetaVisitaOptions.paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.paperTypeSelector) {
        this.paperTypeSelector.updateOptions(this.paperTypeOptions);
      }
      // Resetear la selección de tipo de papel
      this.order.paperType = this.paperTypeOptions[0];
    }
    this.updateReady();
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
    if (this.paperCategorySelector) {
      this.paperCategorySelector.enable();
    }
    if (this.paperTypeSelector) {
      this.paperTypeSelector.enable();
    }
  }

  ngOnInit() {
    this.order = {
      finishType: undefined,
      printForm: undefined,
      paperCategory: undefined,
      paperType: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };

    // Inicializar las opciones de papel disponibles con la categoría por defecto
    const defaultCategory = this.tarjetaVisitaOptions.paperCategory.find(
      (cat) => cat.default
    );
    if (defaultCategory) {
      this.paperTypeOptions =
        this.tarjetaVisitaOptions.paperType[defaultCategory.code] || [];
    }

    super.ngOnInit();
  }
}

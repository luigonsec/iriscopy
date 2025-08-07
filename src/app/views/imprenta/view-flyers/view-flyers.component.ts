import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import Flyer from '../../../interfaces/Flyer';
import flyerOptions from 'src/config/flyers';
import { FormBase } from '../../../_classes/form-base.class';
import { PricesService } from '../../../services/prices.service';
import { firstValueFrom } from 'rxjs';
import { ShopcartService } from '../../../services/shopcart.service';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';
@Component({
  selector: 'app-view-flyers',
  templateUrl: './view-flyers.component.html',
  styleUrls: ['./view-flyers.component.scss'],
  standalone: false,
})
export class ViewFlyersComponent extends FormBase<Flyer> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('printFormSelector')
  public printFormSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;
  @ViewChild('paperCategorySelector')
  public paperCategorySelector: SelectButtonComponent;
  @ViewChild('paperTypeSelector')
  public paperTypeSelector: SelectButtonComponent;

  public flyerOptions = flyerOptions;
  public availablePaperTypes: any[] = [];

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();

    // Configurar el validador y el servicio de mensajes
    this.setFileValidator(
      FileValidatorFactory.createFlyerValidator(flyerOptions)
    );
    this.setMessageService(messageService);
  }

  isCustomSize() {
    if (this.order.paperSize) {
      if (this.order.paperSize.code === 'personalizado') {
        return true;
      }
    }
    return false;
  }

  /**
   * Maneja el cambio de categoría de papel y actualiza las opciones disponibles
   */
  onPaperCategoryChange(category: any) {
    if (category && category.code) {
      this.availablePaperTypes =
        this.flyerOptions.paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.paperTypeSelector) {
        this.paperTypeSelector.updateOptions(this.availablePaperTypes);
      }
      // Resetear la selección de tipo de papel
      this.order.paperType = this.availablePaperTypes[0];
    }
    this.updateReady();
  }

  updateReady() {
    let res = true;

    if (!this.order.paperCategory) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.paperSize) res = false;
    if (!this.order.copiesQuantity) res = false;
    if (!this.order.files || !this.order.files.length) res = false;

    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getFlyerPrice(this.order));
  };

  addToCartFn = async (order: Flyer) => {
    return this.shopCart.addFlyerToCart.bind(this.shopCart)(order);
  };

  /**
   * Configura automáticamente el printForm basado en el número de páginas
   */
  protected setRecommendedPrintForm(printFormCode: string): void {
    const printFormOption = this.flyerOptions.printForm.find(
      (option) => option.code === printFormCode
    );

    if (printFormOption && this.printFormSelector) {
      this.printFormSelector.setUpOption(printFormOption);
      this.printFormSelector.disable();
    }
  }

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    if (this.paperSizeSelector && paperSize) {
      // Buscar la opción correspondiente en las opciones del componente
      const matchingOption = this.flyerOptions.paperSize.find(
        (option) => option.code === paperSize.code
      );

      if (matchingOption) {
        this.paperSizeSelector.setUpOption(matchingOption);
        this.paperSizeSelector.disable();
      }
    }
  }

  /**
   * Restaura la configuración cuando se elimina un archivo
   */
  public undoPresetProperties(): void {
    if (this.printFormSelector) {
      this.printFormSelector.enable();
    }
    if (this.paperSizeSelector) {
      this.paperSizeSelector.enable();
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
      paperSize: undefined,
      printForm: undefined,
      paperCategory: undefined,
      paperType: undefined,
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };

    // Inicializar las opciones de papel disponibles con la categoría por defecto
    const defaultCategory = this.flyerOptions.paperCategory.find(
      (cat) => cat.default
    );
    if (defaultCategory) {
      this.availablePaperTypes =
        this.flyerOptions.paperType[defaultCategory.code] || [];
    }

    super.ngOnInit();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import cartelesOptions from 'src/config/carteles';
import Cartel from '../../../interfaces/Cartel';
import Option from '../../../interfaces/Option';
import { FormBase } from '../../../_classes/form-base.class';
import { ShopcartService } from '../../../services/shopcart.service';
import { PricesService } from '../../../services/prices.service';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-view-carteles',
  templateUrl: './view-carteles.component.html',
  styleUrls: ['./view-carteles.component.scss'],
  standalone: false,
})
export class ViewCartelesComponent extends FormBase<Cartel> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('paperCategorySelector')
  public paperCategorySelector: SelectButtonComponent;
  @ViewChild('paperTypeSelector')
  public paperTypeSelector: SelectButtonComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;

  public cartelesOptions = cartelesOptions;
  public paperTypeOptions: Option[] = [];

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();

    // Configurar el validador específico para carteles (solo 1 página)
    this.setFileValidator(
      FileValidatorFactory.createCartelValidator(cartelesOptions)
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

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getPosterPrice(this.order));
  };

  updateReady() {
    let res = true;

    if (!this.order.paperCategory) res = false;
    if (!this.order.paperType) res = false;
    if (!this.order.paperSize) res = false;
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
        this.cartelesOptions.paperType[category.code] || [];
      // Actualizar las opciones del selector de tipo de papel
      if (this.paperTypeSelector) {
        this.paperTypeSelector.updateOptions(this.paperTypeOptions);
      }
      // Resetear la selección de tipo de papel
      this.order.paperType = this.paperTypeOptions[0];
    }
    this.updateReady();
  }

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    if (this.paperSizeSelector && paperSize) {
      // Buscar la opción correspondiente en las opciones del componente
      const matchingOption = this.cartelesOptions.paperSize.find(
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

  addToCartFn = async (order: Cartel) => {
    return this.shopCart.addPosterToCart.bind(this.shopCart)(order);
  };

  ngOnInit() {
    this.order = {
      printForm: {
        name: 'Una cara',
        code: 'una-cara',
      },
      paperCategory: undefined,
      paperType: undefined,
      paperSize: undefined,
      size: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };

    // Inicializar las opciones de papel disponibles con la categoría por defecto
    const defaultCategory = this.cartelesOptions.paperCategory.find(
      (cat) => cat.default
    );
    if (defaultCategory) {
      this.paperTypeOptions =
        this.cartelesOptions.paperType[defaultCategory.code] || [];
    }

    super.ngOnInit();
  }
}

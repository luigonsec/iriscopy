import { Component, OnInit, ViewChild } from '@angular/core';
import { UploaderComponent } from 'src/app/components/uploader/uploader.component';
import rollupsOptions from 'src/config/rollups';
import Rollup from '../../../interfaces/Rollup';
import { FormBase } from '../../../_classes/form-base.class';
import { firstValueFrom } from 'rxjs';
import { PricesService } from '../../../services/prices.service';
import { ShopcartService } from '../../../services/shopcart.service';
import { FileValidatorFactory } from '../../../_helpers/file-validator';
import { MessageService } from 'primeng/api';
import { SelectButtonComponent } from '../../../components/inputs/select-button/select-button.component';

@Component({
  selector: 'app-view-rollups',
  templateUrl: './view-rollups.component.html',
  styleUrls: ['./view-rollups.component.scss'],
  standalone: false,
})
export class ViewRollupsComponent extends FormBase<Rollup> implements OnInit {
  @ViewChild('uploader') public uploader: UploaderComponent;
  @ViewChild('paperSizeSelector')
  public paperSizeSelector: SelectButtonComponent;
  public rollupsOptions = rollupsOptions;

  constructor(
    public pricesService: PricesService,
    public shopCart: ShopcartService,
    public messageService: MessageService
  ) {
    super();

    // Configurar el validador y el servicio de mensajes
    this.setFileValidator(
      FileValidatorFactory.createRollupValidator(rollupsOptions)
    );
    this.setMessageService(messageService);
  }

  updateReady() {
    let res = true;
    if (!this.order.paperSize) res = false;
    if (!this.order.files || !this.order.files.length) res = false;
    this.ready = res;
  }

  getPrice = async () => {
    return await firstValueFrom(this.pricesService.getRollUpPrice(this.order));
  };

  addToCartFn = async (order: Rollup) => {
    return this.shopCart.addRollupToCart.bind(this.shopCart)(order);
  };

  /**
   * Configura automáticamente el tamaño del papel basado en las dimensiones del archivo
   */
  protected setDetectedSize(paperSize: any): void {
    if (this.paperSizeSelector && paperSize) {
      // Buscar la opción correspondiente en las opciones del componente
      const matchingOption = this.rollupsOptions.paperSize.find(
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
  }

  ngOnInit() {
    this.order = {
      paperSize: undefined,
      copiesQuantity: 0,
      additionalComments: '',
      files: [],
    };
    super.ngOnInit();
  }
}

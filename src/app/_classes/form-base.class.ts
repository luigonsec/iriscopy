import { Subscription } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { UploaderComponent } from '../components/uploader/uploader.component';
import File from '../interfaces/File';
import { FileValidator, ValidationResult } from '../_helpers/file-validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-base',
  template: '',
})
export abstract class FormBase<T> {
  public order: T;
  public ready = false;
  protected fileValidator?: FileValidator;
  protected messageService?: MessageService;

  @ViewChild('uploader') public uploader: UploaderComponent;
  orderSubscription: Subscription;

  constructor() {}

  reset() {
    this.uploader.clear();
    this.updateReady();
  }

  removeFile(id) {
    this.undoPresetProperties();
    this.order['files'] = this.order['files'].filter((x) => x.id !== id);
    this.updateReady();
  }

  getProperty(property, value) {
    this.order[property] = value;
    this.order = Object.assign({}, this.order);
    this.updateReady();
  }

  abstract updateReady(): void;

  abstract getPrice(): Promise<{ precio: number; notas: string[] }>;

  abstract addToCartFn(order: T): Promise<void>;

  /**
   * Configura el validador de archivos
   */
  protected setFileValidator(validator: FileValidator): void {
    this.fileValidator = validator;
  }

  /**
   * Configura el servicio de mensajes
   */
  protected setMessageService(messageService: MessageService): void {
    this.messageService = messageService;
  }

  public validateFiles(files: File[]): boolean {
    if (!files || files.length === 0) {
      return false;
    }

    // Si no hay validador configurado, usar validación básica
    if (!this.fileValidator) {
      return true;
    }

    const file = files[0];
    const validationResult = this.fileValidator.validateFile(file);

    if (!validationResult.isValid) {
      this.handleValidationErrors(validationResult);
      this.uploader.removeFile(file);
      return false;
    }

    // Aplicar configuraciones automáticas basadas en la validación
    this.applyAutoConfiguration(validationResult);

    return true;
  }

  /**
   * Maneja los errores de validación mostrando mensajes al usuario
   */
  private handleValidationErrors(validationResult: ValidationResult): void {
    if (!this.messageService) {
      console.error(
        'MessageService no configurado para mostrar errores de validación'
      );
      return;
    }

    const errorMessages = validationResult.errors
      .map((error) => error.message)
      .join('.\n');

    this.messageService.add({
      severity: 'error',
      summary: 'Archivo no válido',
      detail: errorMessages,
      life: 5000,
    });
  }

  /**
   * Aplica configuraciones automáticas basadas en el resultado de validación
   */
  protected applyAutoConfiguration(validationResult: ValidationResult): void {
    // Implementación por defecto - las clases hijas pueden sobrescribir
    if (validationResult.recommendedPrintForm) {
      this.setRecommendedPrintForm(validationResult.recommendedPrintForm);
    }

    if (validationResult.matchedSize) {
      this.setDetectedSize(validationResult.matchedSize);
    }

    if (validationResult.detectedOrientation) {
      this.setDetectedOrientation(validationResult.detectedOrientation);
    }
  }

  /**
   * Métodos que las clases hijas pueden implementar para configuración automática
   */
  protected setRecommendedPrintForm(printFormCode: string): void {
    // Implementación por defecto vacía
  }

  protected setDetectedSize(paperSize: any): void {
    // Implementación por defecto vacía
  }

  protected setDetectedOrientation(orientation: string): void {
    // Implementación por defecto vacía
  }

  public presetProperties(file: File) {
    return;
  }

  public undoPresetProperties() {
    return;
  }

  public displayFileUploadInstructions() {
    return;
  }

  getFile(files: File[]) {
    const isValid = this.validateFiles(files);

    if (!!!isValid) {
      return this.displayFileUploadInstructions();
    }

    const firstFile = files[0];
    this.presetProperties(firstFile);

    this.order['files'] = files.map((file) => Object.assign({}, file));
    this.order['files'] = this.order['files'];
    this.order = Object.assign({}, this.order);
    this.updateReady();
  }

  ngOnInit() {
    this.reset = this.reset.bind(this);
    this.updateReady();
  }
}

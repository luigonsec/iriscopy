import { TestBed } from '@angular/core/testing';

import { ShopcartService } from './shopcart.service';
import { OrderCopy } from '../interfaces/OrderCopy';
import { MessageService } from 'primeng/api';

describe('ShopcartService', () => {
  let service: ShopcartService;

  beforeEach(() => {
    const messageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: messageService }],
    });
    service = TestBed.inject(ShopcartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ValidateShopcart', () => {
    it('should return false when a shopcart is defined but copies is not an array', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: {} as OrderCopy[],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not paperSize', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [{} as OrderCopy],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid paperSize', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [{ paperSize: { code: 'A5' } } as OrderCopy],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not paperType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [{ paperSize: { code: 'A3' } } as OrderCopy],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid paperType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not printType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A3' },
            paperType: { code: 'normal' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid printType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'cartulina' },
            printType: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not printForm', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A3' },
            paperType: { code: 'cartulina' },
            printType: { code: 'blanco-negro' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid printForm', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'fotografico' },
            printType: { code: 'color-pro' },
            printForm: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not orientation', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A3' },
            paperType: { code: 'cartulina' },
            printType: { code: 'color' },
            printForm: { code: 'una-cara' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid orientation', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'normal' },
            printType: { code: 'blanco-negro' },
            printForm: { code: 'doble-cara' },
            orientation: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not pagesPerSide', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A3' },
            paperType: { code: 'normal' },
            printType: { code: 'color-pro' },
            printForm: { code: 'una-cara' },
            orientation: { code: 'vertical-derecha-izquierda' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid pagesPerSide', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'fotografico' },
            printType: { code: 'blanco-negro' },
            printForm: { code: 'una-cara' },
            orientation: { code: 'horizontal-derecha-izquierda' },
            pagesPerSide: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not finishType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A3' },
            paperType: { code: 'normal' },
            printType: { code: 'color' },
            printForm: { code: 'doble-cara' },
            orientation: { code: 'vertical-arriba-abajo' },
            pagesPerSide: { code: '1_vertical' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid finishType', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'normal' },
            printType: { code: 'color-pro' },
            printForm: { code: 'doble-cara' },
            orientation: { code: 'horizontal-arriba-abajo' },
            pagesPerSide: { code: '1_vertical' },
            finishType: { code: 'other' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return true when a shopcart is defined and all fields are valid', () => {
      spyOn(service, 'getCart').and.returnValue({
        copies: [
          {
            paperSize: { code: 'A4' },
            paperType: { code: 'normal' },
            printType: { code: 'color-pro' },
            printForm: { code: 'doble-cara' },
            orientation: { code: 'horizontal-abajo-arriba' },
            pagesPerSide: { code: '1_vertical' },
            finishType: { code: 'plastificado' },
          } as OrderCopy,
        ],
        products: [],
      });

      const result = service.validate();
      expect(result).toBeTrue();
    });
  });
});

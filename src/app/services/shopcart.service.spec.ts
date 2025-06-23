import { TestBed } from '@angular/core/testing';

import { ShopcartService } from './shopcart.service';
import { OrderCopy } from '../interfaces/OrderCopy';
import { MessageService } from 'primeng/api';
import { OrdersService } from './orders.service';
import Cart from '../interfaces/Cart';

describe('ShopcartService', () => {
  let service: ShopcartService;
  let ordersService: OrdersService;

  // Función de ayuda para crear un carrito vacío
  const createEmptyCart = (): Cart => {
    return {
      copies: [],
      products: [],
      bussinessCard: [],
      flyers: [],
      folders: [],
      diptychs: [],
      triptychs: [],
      rollups: [],
    };
  };

  beforeEach(() => {
    const messageService = jasmine.createSpyObj('MessageService', ['add']);
    const ordersService = jasmine.createSpyObj('OrdersService', [
      'orderCopyToAnalytics',
      'orderProductToAnalytics',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: OrdersService, useValue: ordersService },
      ],
    });
    service = TestBed.inject(ShopcartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ValidateShopcart', () => {
    it('should return false when a shopcart is defined but copies is not an array', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = {} as OrderCopy[];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not paperSize', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [{} as OrderCopy];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid paperSize', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [{ paperSize: { code: 'A5' } } as OrderCopy];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not paperType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [{ paperSize: { code: 'A3' } } as OrderCopy];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid paperType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not printType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A3' },
          paperType: { code: 'normal' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid printType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'cartulina' },
          printType: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not printForm', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A3' },
          paperType: { code: 'cartulina' },
          printType: { code: 'blanco-negro' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid printForm', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'fotografico' },
          printType: { code: 'color-pro' },
          printForm: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not orientation', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A3' },
          paperType: { code: 'cartulina' },
          printType: { code: 'color' },
          printForm: { code: 'una-cara' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid orientation', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'normal' },
          printType: { code: 'blanco-negro' },
          printForm: { code: 'doble-cara' },
          orientation: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not pagesPerSide', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A3' },
          paperType: { code: 'normal' },
          printType: { code: 'color-pro' },
          printForm: { code: 'una-cara' },
          orientation: { code: 'vertical-derecha-izquierda' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid pagesPerSide', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'fotografico' },
          printType: { code: 'blanco-negro' },
          printForm: { code: 'una-cara' },
          orientation: { code: 'horizontal-derecha-izquierda' },
          pagesPerSide: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not finishType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A3' },
          paperType: { code: 'normal' },
          printType: { code: 'color' },
          printForm: { code: 'doble-cara' },
          orientation: { code: 'vertical-arriba-abajo' },
          pagesPerSide: { code: '1_vertical' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return false when a shopcart is defined but some copy has not valid finishType', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'normal' },
          printType: { code: 'color-pro' },
          printForm: { code: 'doble-cara' },
          orientation: { code: 'horizontal-arriba-abajo' },
          pagesPerSide: { code: '1_vertical' },
          finishType: { code: 'other' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeFalse();
    });

    it('should return true when a shopcart is defined and all fields are valid', () => {
      const mockCart = createEmptyCart();
      mockCart.copies = [
        {
          paperSize: { code: 'A4' },
          paperType: { code: 'normal' },
          printType: { code: 'color-pro' },
          printForm: { code: 'doble-cara' },
          orientation: { code: 'horizontal-abajo-arriba' },
          pagesPerSide: { code: '1_vertical' },
          finishType: { code: 'plastificado' },
        } as OrderCopy,
      ];
      spyOn(service, 'getCart').and.returnValue(mockCart);

      const result = service.validate();
      expect(result).toBeTrue();
    });
  });
});

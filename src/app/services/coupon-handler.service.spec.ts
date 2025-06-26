import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CouponHandlerService } from './coupon-handler.service';
import { MessageService } from 'primeng/api';
import { CouponsService } from './coupons.service';
import { of, throwError } from 'rxjs';
import Coupon from '../interfaces/Coupon';
import { applyCoupon, clearCoupon } from '../_actions/coupons.actions';
import moment from 'moment';

describe('CouponHandlerService', () => {
  let service: CouponHandlerService;
  let store: MockStore;
  let messageService: jasmine.SpyObj<MessageService>;
  let couponsService: jasmine.SpyObj<CouponsService>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const couponsServiceSpy = jasmine.createSpyObj('CouponsService', [
      'validate',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CouponHandlerService,
        provideMockStore({}),
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: CouponsService, useValue: couponsServiceSpy },
      ],
    });
    service = TestBed.inject(CouponHandlerService);
    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    couponsService = TestBed.inject(
      CouponsService
    ) as jasmine.SpyObj<CouponsService>;

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('removeCoupon', () => {
    it('should dispatch clearCoupon action', () => {
      service.removeCoupon({
        code: 'TEST10',
        id: 1,
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 5,
        maximum_amount: 100,
        applicability: 'all',
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        clearCoupon({
          coupon: {
            code: 'TEST10',
            id: 1,
            discount_type: 'percent',
            amount: 10,
            minimum_amount: 5,
            maximum_amount: 100,
            applicability: 'all',
          },
        })
      );
    });
  });

  describe('getCoupon', () => {
    it('should validate coupon and dispatch applyCoupon action on success', (done) => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 5,
        maximum_amount: 100,
        applicability: 'all',
      };
      couponsService.validate.and.returnValue(of(mockCoupon));

      service.getCoupon('TEST10').subscribe(() => {
        expect(couponsService.validate).toHaveBeenCalledWith('TEST10');
        expect(store.dispatch).toHaveBeenCalled();
        done();
      });
    });

    it('should show error message on validation failure', (done) => {
      couponsService.validate.and.returnValue(
        throwError(() => new Error('Not found'))
      );

      service.getCoupon('INVALID').subscribe({
        error: () => {
          expect(couponsService.validate).toHaveBeenCalledWith('INVALID');
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            detail: 'El código promocional no existe',
            summary: 'Código erróneo',
          });
          done();
        },
      });
    });
  });

  describe('validateCoupon', () => {
    it('should return false when coupon is null', () => {
      const result = service.validateCoupon(null, 100, () => {});
      expect(result).toBeFalse();
    });

    it('should return false when minimum amount is not met', () => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 50,
        maximum_amount: 100,
        applicability: 'all',
      };

      const result = service.validateCoupon(mockCoupon, 40, () => {});

      expect(result).toBeFalse();
      expect(messageService.add).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        clearCoupon({ coupon: mockCoupon })
      );
    });

    it('should return false when coupon is expired', () => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 5,
        maximum_amount: 100,
        valid_until: moment().subtract(1, 'day').valueOf(),
        applicability: 'all',
      };

      const result = service.validateCoupon(mockCoupon, 100, () => {});

      expect(result).toBeFalse();
      expect(store.dispatch).toHaveBeenCalledWith(
        clearCoupon({ coupon: mockCoupon })
      );
    });

    it('should return true when coupon is valid and apply it', () => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 5,
        maximum_amount: 100,
        valid_until: moment().add(1, 'day').valueOf(),
        applicability: 'all',
      };

      const calcularPrecios = jasmine.createSpy('calcularPrecios');

      const result = service.validateCoupon(mockCoupon, 100, calcularPrecios);

      expect(result).toBeTrue();
      expect(store.dispatch).toHaveBeenCalledWith(
        applyCoupon({ coupon: mockCoupon })
      );
      expect(calcularPrecios).toHaveBeenCalled();
    });
  });

  describe('getDiscount', () => {
    it('should return 0 when no coupon is provided', () => {
      expect(service.getDiscount(100, null)).toBe(0);
    });

    it('should calculate percentage discount correctly', () => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'percent',
        amount: 10,
        minimum_amount: 0,
        maximum_amount: 100,
        applicability: 'all',
      };

      expect(service.getDiscount(100, mockCoupon)).toBe(10);
    });

    it('should apply fixed cart discount correctly', () => {
      const mockCoupon: Coupon = {
        id: 1,
        code: 'TEST10',
        discount_type: 'fixed_cart',
        amount: 10,
        minimum_amount: 0,
        maximum_amount: 100,
        applicability: 'all',
      };

      expect(service.getDiscount(100, mockCoupon)).toBe(10);
    });
  });
});

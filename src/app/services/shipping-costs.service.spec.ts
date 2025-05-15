import { ShippingCostsService } from './shipping-costs.service';
import { LocationsService } from './locations.service';
import { TestBed } from '@angular/core/testing';

const mockGeneralConfig = {
  SHIPPING_COST: 5.5,
};

describe('ShippingCostsService', () => {
  let service: ShippingCostsService;
  let locationsService: jasmine.SpyObj<LocationsService>;

  beforeEach(() => {
    locationsService = jasmine.createSpyObj('LocationsService', [
      'isCanarias',
      'isBaleares',
      'isMallorca',
      'isIbiza',
      'isMenorca',
      'isFormentera',
    ]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocationsService,
          useValue: locationsService,
        },
      ],
    });
    service = TestBed.inject(ShippingCostsService);
  });

  describe('isUrgentShippingAvailable', () => {
    it('should return false for Canarias', () => {
      locationsService.isCanarias.and.returnValue(true);
      expect(service.isUrgentShippingAvailable('35000')).toBe(false);
    });

    it('should return false for Baleares', () => {
      locationsService.isCanarias.and.returnValue(false);
      locationsService.isBaleares.and.returnValue(true);
      expect(service.isUrgentShippingAvailable('07000')).toBe(false);
    });

    it('should return true for Peninsula', () => {
      locationsService.isCanarias.and.returnValue(false);
      locationsService.isBaleares.and.returnValue(false);
      expect(service.isUrgentShippingAvailable('28001')).toBe(true);
    });
  });

  describe('isStandarShippingAvailable', () => {
    it('should return false for Canarias', () => {
      locationsService.isCanarias.and.returnValue(true);
      expect(service.isStandarShippingAvailable('35000')).toBe(false);
    });

    it('should return false for Baleares', () => {
      locationsService.isBaleares.and.returnValue(true);
      expect(service.isStandarShippingAvailable('07864')).toBe(false);
    });

    it('should return true for Peninsula', () => {
      locationsService.isCanarias.and.returnValue(false);
      expect(service.isStandarShippingAvailable('28001')).toBe(true);
    });
  });

  describe('getGastosDeEnvio', () => {
    beforeEach(() => {
      locationsService.isCanarias.and.returnValue(false);
      locationsService.isMallorca.and.returnValue(false);
      locationsService.isIbiza.and.returnValue(false);
      locationsService.isMenorca.and.returnValue(false);
      locationsService.isFormentera.and.returnValue(false);
    });

    it('should return Canarias shipping cost', () => {
      locationsService.isCanarias.and.returnValue(true);
      expect(service.getGastosDeEnvio(100, '35000')).toBe(23);
    });

    it('should return Mallorca shipping cost', () => {
      locationsService.isMallorca.and.returnValue(true);
      expect(service.getGastosDeEnvio(100, '07000')).toBe(10.3);
    });

    it('should return Ibiza shipping cost', () => {
      locationsService.isIbiza.and.returnValue(true);
      expect(service.getGastosDeEnvio(100, '07800')).toBe(11.9);
    });

    it('should return Menorca shipping cost', () => {
      locationsService.isMenorca.and.returnValue(true);
      expect(service.getGastosDeEnvio(100, '07700')).toBe(11.9);
    });

    it('should return Formentera shipping cost', () => {
      locationsService.isFormentera.and.returnValue(true);
      expect(service.getGastosDeEnvio(100, '07860')).toBe(14.4);
    });

    it('should return Peninsula shipping cost for subtotal < 15', () => {
      expect(service.getGastosDeEnvio(10, '28001')).toBe(4.9);
    });

    it('should return Peninsula shipping cost for subtotal between 15 and 25', () => {
      expect(service.getGastosDeEnvio(20, '28001')).toBe(3.9);
    });

    it('should return Peninsula shipping cost for subtotal between 25 and 39', () => {
      expect(service.getGastosDeEnvio(30, '28001')).toBe(2.9);
    });

    it('should return Peninsula shipping cost for subtotal >= 39', () => {
      expect(service.getGastosDeEnvio(50, '28001')).toBe(0);
    });
  });

  describe('getGastosEnvioPeninsula', () => {
    it('should return 4.9 for subtotal < 15', () => {
      expect(service.getGastosEnvioPeninsula(10)).toBe(4.9);
    });

    it('should return 3.9 for subtotal between 15 and 25', () => {
      expect(service.getGastosEnvioPeninsula(20)).toBe(3.9);
    });

    it('should return 2.9 for subtotal between 25 and 39', () => {
      expect(service.getGastosEnvioPeninsula(30)).toBe(2.9);
    });

    it('should return 0 for subtotal >= 39', () => {
      expect(service.getGastosEnvioPeninsula(40)).toBe(0);
    });

    it('should return 4.9 for subtotal <= 0', () => {
      expect(service.getGastosEnvioPeninsula(0)).toBe(4.9);
    });
  });

  describe('getGastosEnvioCanarias', () => {
    it('should return 23', () => {
      expect(service.getGastosEnvioCanarias()).toBe(23);
    });
  });

  describe('getGastosEnvioMallorca', () => {
    it('should return 10.3', () => {
      expect(service.getGastosEnvioMallorca()).toBe(10.3);
    });
  });

  describe('getGastosEnvioMenorca', () => {
    it('should return 11.9', () => {
      expect(service.getGastosEnvioMenorca()).toBe(11.9);
    });
  });

  describe('getGastosEnvioIbiza', () => {
    it('should return 11.9', () => {
      expect(service.getGastosEnvioIbiza()).toBe(11.9);
    });
  });

  describe('getGastosEnvioFormentera', () => {
    it('should return 14.4', () => {
      expect(service.getGastosEnvioFormentera()).toBe(14.4);
    });
  });
});

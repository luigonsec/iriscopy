import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProcessingComponent } from './order-processing.component';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { CouponsService } from 'src/app/services/coupons.service';
import { Store } from '@ngrx/store';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { of } from 'rxjs';
import { ShippingCostsService } from '../../services/shipping-costs.service';

describe('OrderProcessingComponent', () => {
  let component: OrderProcessingComponent;
  let fixture: ComponentFixture<OrderProcessingComponent>;
  let messageService: jasmine.SpyObj<MessageService>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let redsysService: jasmine.SpyObj<RedsysService>;
  let couponsService: jasmine.SpyObj<CouponsService>;
  let shopcartService: jasmine.SpyObj<ShopcartService>;
  let store: jasmine.SpyObj<Store>;
  let shippingCostsService: jasmine.SpyObj<ShippingCostsService>;

  beforeEach(async () => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    shopcartService = jasmine.createSpyObj('ShopcartService', [
      'getCart',
      'getCart$',
    ]);

    shopcartService.getCart$.and.returnValue(of({ copies: [], products: [] }));

    shopcartService.getCart.and.returnValue({ copies: [], products: [] });
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    couponsService = jasmine.createSpyObj('CouponsService', ['validate']);
    redsysService = jasmine.createSpyObj('RedsysService', ['sendPayment']);
    ordersService = jasmine.createSpyObj('OrdersService', [
      'getOrderPrice',
      'create',
    ]);
    shippingCostsService = jasmine.createSpyObj('ShippingCostsService', [
      'getGastosDeEnvio',
      'isUrgentShippingAvailable',
    ]);

    ordersService.getOrderPrice.and.returnValue(of(0));

    store.select.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: store,
        },
        {
          provide: ShippingCostsService,
          useValue: shippingCostsService,
        },
        {
          provide: ShopcartService,
          useValue: shopcartService,
        },
        {
          provide: MessageService,
          useValue: messageService,
        },
        {
          provide: OrdersService,
          useValue: ordersService,
        },
        {
          provide: RedsysService,
          useValue: redsysService,
        },
        {
          provide: CouponsService,
          useValue: couponsService,
        },
      ],
      declarations: [OrderProcessingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

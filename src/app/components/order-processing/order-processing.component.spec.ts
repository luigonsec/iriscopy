import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProcessingComponent } from './order-processing.component';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { Store } from '@ngrx/store';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { of } from 'rxjs';
import Cart from 'src/app/interfaces/Cart';
import { LoadingService } from '../../services/loading.service';
import { CouponHandlerService } from '../../services/coupon-handler.service';
import { PricesService } from '../../services/prices.service';

describe('OrderProcessingComponent', () => {
  let component: OrderProcessingComponent;
  let fixture: ComponentFixture<OrderProcessingComponent>;
  let shopcartService: jasmine.SpyObj<ShopcartService>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let redsysService: jasmine.SpyObj<RedsysService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let couponsService: jasmine.SpyObj<CouponHandlerService>;
  let pricesService: jasmine.SpyObj<PricesService>;
  let store: jasmine.SpyObj<Store>;

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

  beforeEach(async () => {
    store = jasmine.createSpyObj('Store', ['dispatch']);

    shopcartService = jasmine.createSpyObj('ShopcartService', [
      'getCart',
      'getCart$',
    ]);

    const emptyCart = createEmptyCart();
    shopcartService.getCart$.and.returnValue(of(emptyCart));
    shopcartService.getCart.and.returnValue(emptyCart);
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    couponsService = jasmine.createSpyObj('CouponsService', [
      'getDiscount',
      'subscribeCoupon',
    ]);
    redsysService = jasmine.createSpyObj('RedsysService', ['sendPayment']);
    ordersService = jasmine.createSpyObj('OrdersService', ['create']);
    pricesService = jasmine.createSpyObj('PricesService', ['getOrderPrice']);
    pricesService.getOrderPrice.and.returnValue(of(100));

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: store,
        },
        {
          provide: ShopcartService,
          useValue: shopcartService,
        },
        {
          provide: PricesService,
          useValue: pricesService,
        },
        {
          provide: LoadingService,
          useValue: loadingService,
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
          provide: CouponHandlerService,
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

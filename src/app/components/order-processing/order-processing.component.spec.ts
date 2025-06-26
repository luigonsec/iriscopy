import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderProcessingComponent } from './order-processing.component';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';
import { RedsysService } from 'src/app/services/redsys.service';
import { Store } from '@ngrx/store';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { of, throwError } from 'rxjs';
import Cart from 'src/app/interfaces/Cart';
import { LoadingService } from '../../services/loading.service';
import { CouponHandlerService } from '../../services/coupon-handler.service';
import { PricesService } from '../../services/prices.service';
import { ShippingHandlerService } from '../../services/shipping-handler.service';
import { OrderBuilderService } from '../../services/order-builder.service';
import { AnalyticsService } from '../../services/analytics.service';
import { HttpErrorResponse } from '@angular/common/http';
import Coupon from 'src/app/interfaces/Coupon';

describe('OrderProcessingComponent', () => {
  let component: OrderProcessingComponent;
  let fixture: ComponentFixture<OrderProcessingComponent>;
  let shopcartService: jasmine.SpyObj<ShopcartService>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let redsysService: jasmine.SpyObj<RedsysService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let couponHandlerService: jasmine.SpyObj<CouponHandlerService>;
  let pricesService: jasmine.SpyObj<PricesService>;
  let shippingHandlerService: jasmine.SpyObj<ShippingHandlerService>;
  let orderBuilderService: jasmine.SpyObj<OrderBuilderService>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;
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

  // Función de ayuda para crear un carrito con elementos
  const createCartWithItems = (): Cart => {
    // Creamos elementos de prueba con tipos adecuados
    const testOption = {
      code: 'test-code',
      name: 'Test',
      description: 'Test description',
    };
    const testFile = {
      id: '1',
      url: 'http://example.com/test.pdf',
      name: 'test.pdf',
      original_filename: 'test.pdf',
      size: 1024,
      pages: 5,
      source: 'upload',
      image: null,
    };

    return {
      copies: [
        {
          id: '1',
          printType: testOption,
          paperSize: testOption,
          paperType: testOption,
          printForm: testOption,
          pagesPerSide: testOption,
          boundType: null,
          boundColors: null,
          finishType: null,
          orientation: testOption,
          copiesQuantity: 10,
          files: [testFile],
          additionalComments: '',
          printTypeCover: testOption,
          boundPages: null,
        },
      ],
      products: [
        {
          product: {
            id: 1,
            name: 'Test Product',
            price: '15.99',
            regular_price: '15.99',
            slug: 'test-product',
            permalink: 'http://example.com/product/test',
            date_created: '2025-01-01',
            date_created_gmt: '2025-01-01',
            date_modified: '2025-01-01',
            date_modified_gmt: '2025-01-01',
            yoast_head:
              '<meta name="description" content="Test product description">',
            yoast_head_json: {
              title: 'Test Product',
              description: 'Test product description',
              og_title: 'Test Product',
              og_description: 'Test product description',
            },
            _links: {
              self: [{ href: 'http://example.com/product/test' }],
              collection: [{ href: 'http://example.com/products' }],
              up: [{ href: 'http://example.com/products/1' }],
            },

            type: 'simple',
            status: 'publish',
            featured: false,
            catalog_visibility: 'visible',
            description: 'Test description',
            short_description: 'Test short description',
            sku: 'TEST-SKU',
            sale_price: null,
            date_on_sale_from: null,
            date_on_sale_from_gmt: null,
            date_on_sale_to: null,
            date_on_sale_to_gmt: null,
            price_html: '<span class="price">15.99€</span>',
            on_sale: false,
            purchasable: true,
            total_sales: 0,
            virtual: false,
            downloadable: false,
            downloads: [],
            download_limit: 0,
            download_expiry: 0,
            external_url: '',
            button_text: '',
            tax_status: 'taxable',
            tax_class: '',
            manage_stock: true,
            stock_quantity: 10,
            stock_status: 'instock',
            backorders: 'no',
            backorders_allowed: false,
            backordered: false,
            sold_individually: false,
            weight: '',
            dimensions: { length: '', width: '', height: '' },
            shipping_required: false,
            shipping_taxable: false,
            shipping_class: '',
            shipping_class_id: 0,
            reviews_allowed: false,
            average_rating: '0',
            rating_count: 0,
            related_ids: [],
            upsell_ids: [],
            cross_sell_ids: [],
            parent_id: 0,
            purchase_note: '',
            categories: [],
            tags: [],
            images: [],
            attributes: [],
            default_attributes: [],
            variations: [],
            grouped_products: [],
            menu_order: 0,
            meta_data: [],
          },
          quantity: 2,
        },
      ],
      bussinessCard: [
        {
          id: '3',
          printForm: testOption,
          paperType: testOption,
          finishType: testOption,
          copiesQuantity: 1,
          files: [testFile],
          additionalComments: '',
        },
      ],
      flyers: [],
      folders: [],
      diptychs: [],
      triptychs: [],
      rollups: [],
    };
  };

  beforeEach(async () => {
    // Create spy objects for all services
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    store.select.and.returnValue(of({}));

    shopcartService = jasmine.createSpyObj('ShopcartService', [
      'getCart',
      'getCart$',
    ]);
    const emptyCart = createEmptyCart();
    shopcartService.getCart$.and.returnValue(of(emptyCart));
    shopcartService.getCart.and.returnValue(emptyCart);

    messageService = jasmine.createSpyObj('MessageService', ['add']);

    couponHandlerService = jasmine.createSpyObj('CouponHandlerService', [
      'getDiscount',
      'subscribeCoupons',
      'validateCoupon',
      'removeCoupon',
      'getCoupon',
    ]);
    // Create a mock subscription
    const mockSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    couponHandlerService.subscribeCoupons.and.callFake((callback) => {
      callback([]);
      return mockSubscription;
    });
    couponHandlerService.validateCoupon.and.returnValue(true);

    redsysService = jasmine.createSpyObj('RedsysService', ['sendPayment']);
    redsysService.sendPayment.and.returnValue(
      of({
        Ds_MerchantParameters: 'params',
        Ds_Signature: 'signature',
        Ds_SignatureVersion: 'version',
      })
    );

    ordersService = jasmine.createSpyObj('OrdersService', ['create']);
    ordersService.create.and.returnValue(of({ order: 123 }));

    pricesService = jasmine.createSpyObj('PricesService', [
      'getOrderPrice',
      'getCopyPrice',
      'getItemPrice',
    ]);
    pricesService.getOrderPrice.and.returnValue(of(100));
    pricesService.getCopyPrice.and.returnValue(
      of({ precio: 50, notas: ['Nota 1'] })
    );
    pricesService.getItemPrice.and.returnValue(
      of({ precio: 25, notas: ['Nota 2'] })
    );

    loadingService = jasmine.createSpyObj('LoadingService', [
      'setLoading',
      'stopLoading',
    ]);

    shippingHandlerService = jasmine.createSpyObj('ShippingHandlerService', [
      'calculateShippingCosts',
      'calculateFinalShippingCost',
      'calculateExpectedDeliveryDate',
    ]);
    shippingHandlerService.calculateShippingCosts.and.returnValue({
      standardCost: 4.9,
      urgentCost: 6.4,
      urgentAvailable: true,
      standardAvailable: true,
    });
    shippingHandlerService.calculateFinalShippingCost.and.returnValue(4.9);
    shippingHandlerService.calculateExpectedDeliveryDate.and.returnValue(
      '2025-07-01'
    );

    orderBuilderService = jasmine.createSpyObj('OrderBuilderService', [
      'buildOrderObject',
    ]);
    orderBuilderService.buildOrderObject.and.returnValue({
      id: null,
      billing: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        responsible: 'Test User',
        address_1: 'Test Address 1',
        address_2: 'Test Address 2',
        city: 'Test City',
        state: 'Test State',
        postcode: '12345',
        phone: '123456789',
        others: '',
      },
      shipping: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        responsible: 'Test User',
        address_1: 'Test Address 1',
        address_2: 'Test Address 2',
        city: 'Test City',
        state: 'Test State',
        postcode: '12345',
        phone: '123456789',
        others: '',
      },
      copies: [],
      products: [],
      payment_method: 'CARD',
      payment_method_title: 'Tarjeta de crédito',
      shipping_lines: [],
      coupons: [],
    });

    analyticsService = jasmine.createSpyObj('AnalyticsService', [
      'infoPago',
      'infoEntrega',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: store },
        { provide: ShopcartService, useValue: shopcartService },
        { provide: PricesService, useValue: pricesService },
        { provide: LoadingService, useValue: loadingService },
        { provide: MessageService, useValue: messageService },
        { provide: OrdersService, useValue: ordersService },
        { provide: RedsysService, useValue: redsysService },
        { provide: CouponHandlerService, useValue: couponHandlerService },
        { provide: ShippingHandlerService, useValue: shippingHandlerService },
        { provide: OrderBuilderService, useValue: orderBuilderService },
        { provide: AnalyticsService, useValue: analyticsService },
      ],
      declarations: [OrderProcessingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProcessingComponent);
    component = fixture.componentInstance;
    // Set up necessary inputs for the component
    component.updateDeliveryMethod = jasmine.createSpy('updateDeliveryMethod');
    component.billing = {
      validate: jasmine.createSpy('validate').and.returnValue(true),
    } as any;
    component.shipping = {
      validate: jasmine.createSpy('validate').and.returnValue(true),
    } as any;
    component.customer = {} as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(component.deliver).toBe('Pickup');
      expect(component.coupons).toEqual([]);
      expect(component.shippingCostStandard).toBe(4.9);
    });

    it('should subscribe to cart changes on init', () => {
      expect(shopcartService.getCart$).toHaveBeenCalled();
      expect(couponHandlerService.subscribeCoupons).toHaveBeenCalled();
    });

    it('should calculate expected delivery date on init', () => {
      expect(
        shippingHandlerService.calculateExpectedDeliveryDate
      ).toHaveBeenCalled();
      expect(component.expectedDeliveryDate).toBe('2025-07-01');
    });

    it('should update cart items when cart changes', () => {
      const cartWithItems = createCartWithItems();
      shopcartService.getCart$.and.returnValue(of(cartWithItems));
      shopcartService.getCart.and.returnValue(cartWithItems);

      component.ngOnInit();

      expect(component.copies.length).toBeGreaterThan(0);
      expect(component.products.length).toBeGreaterThan(0);
      expect(component.businessCards.length).toBeGreaterThan(0);
    });
  });

  describe('price calculation', () => {
    beforeEach(() => {
      // Configure the component with some items
      const cartWithItems = createCartWithItems();
      shopcartService.getCart.and.returnValue(cartWithItems);
      component.copies = cartWithItems.copies;
      component.products = cartWithItems.products;
      component.businessCards = cartWithItems.bussinessCard;
    });

    it('should calculate prices correctly', (done) => {
      // Set up specific returns
      pricesService.getOrderPrice.and.returnValue(of(50));

      component.calcularPrecios(() => {
        expect(component.precio_copias).toBe(50);
        expect(component.subtotal).toBeGreaterThan(0);
        done();
      });
    });

    it('should handle errors in price calculation', (done) => {
      pricesService.getOrderPrice.and.returnValue(
        throwError(() => new Error('Failed to calculate'))
      );

      component.calcularPrecios(() => {
        expect(component.precio_copias).toBe(0);
        done();
      });
    });

    it('should calculate product prices correctly', () => {
      // Product price should be quantity * price
      // 2 * 15.99 = 31.98
      const result = component['calcularPrecioProductos']();
      expect(result).toBeCloseTo(31.98);
    });

    it('should apply coupon discounts correctly', () => {
      const coupon: Coupon = {
        id: 1,
        code: 'TEST10',
        amount: 10,
        discount_type: 'percent',
        minimum_amount: 0,
        maximum_amount: 0,
        valid_until: Date.now() + 86400000, // 24 hours from now
        applicability: 'copies',
      };

      component.coupons = [coupon];
      component.precio_copias = 100;

      couponHandlerService.getDiscount.and.returnValue(10);

      component['applyCopiesCouponDiscounts']();

      expect(component.discounts[coupon.code]).toBe(10);
    });

    it('should calculate shipping costs correctly', () => {
      component.subtotalBeforeShippingCoupons = 100;
      component.calculateGastosDeEnvioEstandar();

      expect(shippingHandlerService.calculateShippingCosts).toHaveBeenCalled();
      expect(component.shippingCostStandard).toBe(4.9);
      expect(component.shippingCostUrgent).toBe(6.4);
    });

    it('should calculate final shipping cost based on delivery method', () => {
      // Standard shipping
      component.deliver = 'Shipping';
      const standardCost = component.getGastosDeEnvio();
      expect(standardCost).toBe(4.9);

      // Urgent shipping
      component.deliver = 'UrgentShipping';
      shippingHandlerService.calculateFinalShippingCost.and.returnValue(6.4);
      const urgentCost = component.getGastosDeEnvio();
      expect(urgentCost).toBe(6.4);

      // Pickup (should be 0)
      component.deliver = 'Pickup';
      shippingHandlerService.calculateFinalShippingCost.and.returnValue(0);
      const pickupCost = component.getGastosDeEnvio();
      expect(pickupCost).toBe(0);
    });

    it('should calculate total with discounts and shipping', () => {
      component.subtotal = 100;
      component.discounts = { TEST10: 10 };
      component.shippingCostFinal = 4.9;

      component.getTotal();

      // Total should be: subtotal - discounts + shipping = 100 - 10 + 4.9 = 94.9
      expect(component.total).toBeCloseTo(94.9);
    });
  });

  describe('coupon handling', () => {
    it('should add valid coupon', () => {
      const coupon: Coupon = {
        id: 1,
        code: 'TEST10',
        amount: 10,
        discount_type: 'percent',
        minimum_amount: 0,
        maximum_amount: 0,
        valid_until: Date.now() + 86400000, // 24 hours from now
        applicability: 'copies',
      };

      component.inputCoupon = 'TEST10';
      couponHandlerService.getCoupon.and.returnValue(of(coupon));

      component.getCoupon();

      expect(component.first_time_coupon_applied).toBeTrue();
      expect(couponHandlerService.getCoupon).toHaveBeenCalledWith('TEST10');
    });

    it('should validate coupon and apply it if valid', () => {
      const coupon: Coupon = {
        id: 1,
        code: 'TEST10',
        amount: 10,
        discount_type: 'percent',
        minimum_amount: 0,
        maximum_amount: 0,
        valid_until: Date.now() + 86400000, // 24 hours from now
        applicability: 'copies',
      };

      const result = component.validateCoupon(coupon);

      expect(result).toBeTrue();
      expect(component.coupons).toEqual([coupon]);
      expect(couponHandlerService.validateCoupon).toHaveBeenCalled();
    });

    it('should remove coupon', () => {
      const coupon: Coupon = {
        id: 1,
        code: 'TEST10',
        amount: 10,
        discount_type: 'percent',
        minimum_amount: 0,
        maximum_amount: 0,
        valid_until: Date.now() + 86400000, // 24 hours from now
        applicability: 'copies',
      };

      component.coupons = [coupon];
      component.removeCoupon(coupon);

      expect(component.coupons).toEqual([]);
      expect(couponHandlerService.removeCoupon).toHaveBeenCalledWith(coupon);
    });
  });

  describe('order processing', () => {
    beforeEach(() => {
      component.payment = 'CARD';
      component.termsAccepted = true;
      component.total = 100;
      component.selectedLocation = { id: 1, name: 'Test Location' } as any;
    });

    it('should validate order before processing', () => {
      // Mock the processOrder method to prevent redirection to Redsys
      spyOn(component, 'processOrder');

      // Happy path
      component.validate();

      expect(component.billing.validate).toHaveBeenCalled();
      expect(component.termsAccepted).toBeTruthy();
      expect(component.processOrder).toHaveBeenCalled();
    });

    it('should process order without redirecting to Redsys', (done) => {
      // Mock the redsysForm and prepareOrder to prevent redirection
      component.redsysForm = {
        nativeElement: {
          submit: jasmine.createSpy('submit').and.callFake(() => {
            // Verify all expectations after form submission
            expect(component.prepareOrder).toHaveBeenCalled();
            expect(component.startPayment).toHaveBeenCalled();
            done(); // Complete the async test
          }),
        },
      };

      spyOn(component, 'prepareOrder').and.callFake((callback) => {
        callback(null, { id: 123 });
        return Promise.resolve();
      });

      // Reemplazar startPayment para ejecutar el callback inmediatamente sin setTimeout
      spyOn(component, 'startPayment').and.callFake((order, callback) => {
        // Ejecutamos el callback directamente, sin pasar por el setTimeout
        component.redsysForm.nativeElement.submit();
      });

      // Execute processOrder
      component.processOrder();
    });

    it('should show error if billing validation fails', () => {
      (component.billing.validate as jasmine.Spy).and.returnValue(false);

      component.validate();

      expect(ordersService.create).not.toHaveBeenCalled();
    });

    it('should show error if shipping validation fails when differentAddress is true', () => {
      component.differentAddress = true;
      (component.shipping.validate as jasmine.Spy).and.returnValue(false);

      component.validate();

      expect(ordersService.create).not.toHaveBeenCalled();
    });

    it('should show error if pickup location is not selected', () => {
      component.selectedLocation = null;
      component.deliver = 'Pickup';

      component.validate();

      expect(messageService.add).toHaveBeenCalled();
      expect(ordersService.create).not.toHaveBeenCalled();
    });

    it('should show error if payment method is not selected', () => {
      component.payment = null;

      component.validate();

      expect(messageService.add).toHaveBeenCalled();
      expect(ordersService.create).not.toHaveBeenCalled();
    });

    it('should show error if terms are not accepted', () => {
      component.termsAccepted = false;

      component.validate();

      expect(messageService.add).toHaveBeenCalled();
      expect(ordersService.create).not.toHaveBeenCalled();
    });

    describe('payment gateway integration', () => {
      beforeEach(() => {
        // Always mock the redsysForm to prevent actual form submission
        component.redsysForm = {
          nativeElement: {
            submit: jasmine.createSpy('submit'),
          },
        };
      });

      it('should process order and start payment successfully', (done) => {
        const order = {
          id: null,
          billing: { first_name: 'Test' } as any,
          shipping: { first_name: 'Test' } as any,
          copies: [],
          products: [],
          payment_method: 'CARD',
          payment_method_title: 'Tarjeta',
          shipping_lines: [],
        };

        component.startPayment(order, () => {
          expect(redsysService.sendPayment).toHaveBeenCalledWith(order, 'CARD');
          expect(component.redsysData).toEqual({
            Ds_MerchantParameters: 'params',
            Ds_Signature: 'signature',
            Ds_SignatureVersion: 'version',
          });
          expect(loadingService.stopLoading).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should handle payment errors', () => {
      const order = {
        id: null,
        billing: { first_name: 'Test' } as any,
        shipping: { first_name: 'Test' } as any,
        copies: [],
        products: [],
        payment_method: 'CARD',
        payment_method_title: 'Tarjeta',
        shipping_lines: [],
      };

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Payment error' },
        status: 400,
      });

      redsysService.sendPayment.and.returnValue(
        throwError(() => errorResponse)
      );

      component.startPayment(order, () => {});

      expect(messageService.add).toHaveBeenCalled();
      expect(loadingService.setLoading).toHaveBeenCalledWith({
        isLoading: false,
      });
    });

    it('should prepare order successfully', (done) => {
      component.prepareOrder((err, order) => {
        expect(err).toBeNull();
        expect(order.id).toBe(123);
        expect(component.OrderID).toBe(123);
        expect(orderBuilderService.buildOrderObject).toHaveBeenCalled();
        expect(ordersService.create).toHaveBeenCalled();
        done();
      });
    });

    it('should handle prepare order errors', (done) => {
      ordersService.create.and.returnValue(
        throwError(() => new Error('Order creation failed'))
      );

      component.prepareOrder((err, order) => {
        expect(err).toBeTruthy();
        expect(order).toBeUndefined();
        expect(loadingService.setLoading).toHaveBeenCalledWith({
          isLoading: false,
        });
        done();
      });
    });
  });

  describe('cart management', () => {
    it('should update cart items correctly', () => {
      const cartWithItems = createCartWithItems();

      component['updateCartItems'](cartWithItems);

      expect(component.copies.length).toBe(1);
      expect(component.products.length).toBe(1);
      expect(component.businessCards.length).toBe(1);
    });

    it('should calculate total cart items correctly', () => {
      const cartWithItems = createCartWithItems();
      component['updateCartItems'](cartWithItems);

      const total = component.getTotalCartItems();

      // Should have 3 items: 1 copy + 1 product + 1 business card
      expect(total).toBe(3);
    });

    it('should detect empty cart correctly', () => {
      const emptyCart = createEmptyCart();
      component['updateCartItems'](emptyCart);

      expect(component.isCartEmpty()).toBeTrue();

      const cartWithItems = createCartWithItems();
      component['updateCartItems'](cartWithItems);

      expect(component.isCartEmpty()).toBeFalse();
    });
  });

  describe('delivery methods and analytics', () => {
    it('should update delivery method', () => {
      component.deliver = 'Shipping';
      component.handleDeliveryMethodChange();

      expect(component.updateDeliveryMethod).toHaveBeenCalledWith('Shipping');
    });

    it('should track delivery method in analytics', () => {
      component.deliver = 'UrgentShipping';
      component.total = 100;

      component.infoEntregaAnalytics();

      expect(analyticsService.infoEntrega).toHaveBeenCalled();
    });

    it('should track payment method in analytics', () => {
      component.payment = 'BIZUM';
      component.total = 100;

      component.infoPagoAnalytics();

      expect(analyticsService.infoPago).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from subscriptions on destroy', () => {
      const mockSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.subcriptorCoupon = mockSubscription;
      component.subscriptionCart = mockSubscription;

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(2);
    });
  });
});

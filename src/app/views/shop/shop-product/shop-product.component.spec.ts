import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopProductComponent } from './shop-product.component';
import { ShopcartService } from 'src/app/services/shopcart.service';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import Product from 'src/app/interfaces/Product';

describe('ShopProductComponent', () => {
  let component: ShopProductComponent;
  let fixture: ComponentFixture<ShopProductComponent>;
  let mockShopCart: jasmine.SpyObj<ShopcartService>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockActiveRouter: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', [
      'findBySlug',
      'getVariations',
    ]);
    mockProductsService.findBySlug.and.returnValue(
      of({
        slug: 'test',
        id: 1000,
        name: 'example',
        images: [{ src: 'link-to-image' }],
      })
    );
    mockActiveRouter = jasmine.createSpyObj('ActivatedRoute', ['params']);
    mockActiveRouter.params = of({
      token: 'abcd',
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ShopProductComponent],
      providers: [
        {
          provide: ShopcartService,
          useValue: mockShopCart,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: ActivatedRoute,
          useValue: mockActiveRouter,
        },

        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not call loadProduct if slugs is empty', () => {
      mockActiveRouter.params = of({});
      spyOn(component, 'loadProduct');

      component.ngOnInit();

      expect(component.loadProduct).not.toHaveBeenCalled();
    });

    it('should call loadProduct if slugs is not empty', () => {
      mockActiveRouter.params = of({ slug: 'example' });
      spyOn(component, 'loadProduct');

      component.ngOnInit();

      expect(component.loadProduct).toHaveBeenCalled();
    });
  });

  describe('loadProduct', () => {
    it('should redirects to index if the product doesnt exists', () => {
      mockProductsService.findBySlug.and.returnValue(of(undefined));
      component.loadProduct();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('loadVariations', () => {
    it('should not call getVariations if product.variations is empty', () => {
      component.product = { variations: [] } as Product;

      component.loadVariations();

      expect(mockProductsService.getVariations).not.toHaveBeenCalled();
    });

    it('should call getVariations if product.variations is not empty', () => {
      component.product = { variations: [{}] } as Product;
      mockProductsService.getVariations.and.returnValue(of({}));
      component.loadVariations();

      expect(mockProductsService.getVariations).toHaveBeenCalled();
    });
  });
});

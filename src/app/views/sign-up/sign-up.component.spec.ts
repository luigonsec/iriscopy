import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { CustomersService } from 'src/app/services/customers.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/app.state';
import { SignUpComponent } from './sign-up.component';
import { HttpErrorResponse } from '@angular/common/http';
import { login } from 'src/app/_actions/customer.actions';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;

  beforeEach(async () => {
    mockCustomerService = jasmine.createSpyObj('CustomersService', [
      'register',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockStore.select.and.returnValue(of(null)); // o usa un valor simulado si es necesario

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      providers: [
        { provide: CustomersService, useValue: mockCustomerService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clear', () => {
    it('should clear all form fields and errors', () => {
      component.email = 'test@test.com';
      component.username = 'testuser';
      component.password = 'Password1!';
      component.passwordConfirm = 'Password1!';
      component.errors = {
        email: 'error',
        username: 'error',
        password: 'error',
        passwordConfirm: 'error',
        general: '',
      };

      component.clear();

      expect(component.email).toBe('');
      expect(component.username).toBe('');
      expect(component.password).toBe('');
      expect(component.passwordConfirm).toBe('');
      expect(component.errors).toEqual({
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
        general: '',
      });
    });
  });

  describe('validate', () => {
    it('should return false if username is empty', () => {
      component.username = '';
      expect(component.validate()).toBe(false);
      expect(component.errors.username).toBe(
        'El nombre de usuario es obligatorio.'
      );
    });

    it('should return false if email is invalid', () => {
      component.email = 'invalid-email';
      component.username = 'validuser';
      expect(component.validate()).toBe(false);
      expect(component.errors.email).toBe(
        'El correo electrónico no es válido.'
      );
    });

    it('should return false if password is too short', () => {
      component.email = 'test@test.com';
      component.username = 'validuser';
      component.password = 'short';
      expect(component.validate()).toBe(false);
      expect(component.errors.password).toBe(
        'La contraseña debe tener al menos 8 caracteres.'
      );
    });

    it('should return false if passwords do not match', () => {
      component.email = 'test@test.com';
      component.username = 'validuser';
      component.password = 'ValidPass1!';
      component.passwordConfirm = 'DifferentPass!';
      expect(component.validate()).toBe(false);
      expect(component.errors.passwordConfirm).toBe(
        'Las contraseñas no coinciden.'
      );
    });

    it('should return true for valid input', () => {
      component.email = 'test@test.com';
      component.username = 'validuser';
      component.password = 'ValidPass1!';
      component.passwordConfirm = 'ValidPass1!';
      expect(component.validate()).toBe(true);
    });
  });

  describe('register', () => {
    it('should call customerService.register and store.dispatch on successful registration', () => {
      component.email = 'test@test.com';
      component.username = 'validuser';
      component.password = 'ValidPass1!';
      component.passwordConfirm = 'ValidPass1!';
      component.validate = jasmine.createSpy().and.returnValue(true);
      mockCustomerService.register.and.returnValue(of({}));

      component.register();

      expect(mockCustomerService.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        username: 'validuser',
        password: 'ValidPass1!',
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        login({ username: 'validuser', password: 'ValidPass1!' })
      );
    });

    it('should handle HttpErrorResponse and reset buttonText on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Error al registrar' },
        status: 400,
      });

      component.validate = jasmine.createSpy().and.returnValue(true);
      mockCustomerService.register.and.returnValue(
        throwError(() => errorResponse)
      );

      component.register();

      expect(component.errors.general).toBe('Error al registrar');
      expect(component.buttonText).toBe('Acceder');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from store selector', () => {
      component.subscriptor = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.subscriptor.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should navigate to /profile if customer is present', () => {
      mockStore.select.and.returnValue(of({}));

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/profile/information'],
        {
          queryParams: { signup: true },
        }
      );
    });
  });
});

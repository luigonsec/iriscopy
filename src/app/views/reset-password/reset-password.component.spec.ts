import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ValidatorsService } from 'src/app/services/validators.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let mockActiveRouter: jasmine.SpyObj<ActivatedRoute>;
  let mockValidator: jasmine.SpyObj<ValidatorsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    usersService = jasmine.createSpyObj('UsersService', ['resetPassword']);
    usersService.resetPassword.and.returnValue(of(undefined));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    mockValidator = jasmine.createSpyObj('ValidatorsService', [
      'validatePassword',
    ]);
    mockRouter.navigate = jasmine.createSpy();
    mockActiveRouter = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    mockActiveRouter.queryParams = of({
      token: 'abcd',
    });
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UsersService, useValue: usersService },
        { provide: MessageService, useValue: messageService },
        { provide: ActivatedRoute, useValue: mockActiveRouter },
        { provide: ValidatorsService, useValue: mockValidator },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkToken', () => {
    it('should call redirect if token is empty', () => {
      component.token = undefined;
      component.checkToken();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not call redirect if token is not empty', () => {
      component.token = 'abcd';
      component.checkToken();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('should display the error message from the validator when the password is invalid', () => {
      const someMessage = 'Some Message';
      mockValidator.validatePassword.and.returnValue({
        isValid: false,
        message: someMessage,
      });

      component.validate();

      expect(component.errors.password).toEqual(someMessage);
    });

    it('should not call resetPassword when password is invalid', () => {
      spyOn(component, 'resetPassword');
      const someMessage = 'Some Message';
      mockValidator.validatePassword.and.returnValue({
        isValid: false,
        message: someMessage,
      });

      component.validate();

      expect(component.resetPassword).not.toHaveBeenCalled();
    });

    it('should not call resetPassword when passwords are diferent', () => {
      spyOn(component, 'resetPassword');
      component.password = 'password_1';
      component.confirm = 'password_2';
      mockValidator.validatePassword.and.returnValue({
        isValid: true,
        message: undefined,
      });

      component.validate();

      expect(component.resetPassword).not.toHaveBeenCalled();
    });

    it('should call resetPassword when passwords are ok', () => {
      spyOn(component, 'resetPassword');
      component.password = 'password_1';
      component.confirm = 'password_1';
      mockValidator.validatePassword.and.returnValue({
        isValid: true,
        message: undefined,
      });

      component.validate();

      expect(component.resetPassword).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset passwords when resetPasswords works', () => {
      usersService.resetPassword.and.returnValue(of(undefined));

      component.resetPassword();

      expect(component.password).toBe('');
      expect(component.confirm).toBe('');
      expect(component.errors.password).toBe('');
      expect(component.errors.confirm).toBe('');
    });

    it('should display a success message if password is reset', () => {
      usersService.resetPassword.and.returnValue(of(undefined));

      component.resetPassword();

      expect(messageService.add).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: 'Contraseña modificada',
        detail:
          'La nueva contraseña ha sido establecida con éxito y ya puedes iniciar sesión con ella',
      });
    });

    it('should display a success message if password is reset', () => {
      usersService.resetPassword.and.returnValue(
        throwError(() => new Error('Error'))
      );

      component.resetPassword();

      expect(messageService.add).toHaveBeenCalledOnceWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error modificando la contraseña',
      });
    });
  });
});

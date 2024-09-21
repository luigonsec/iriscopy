import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordComponent } from './user-password.component';
import { ValidatorsService } from 'src/app/services/validators.service';
import { Store } from '@ngrx/store';
import { UsersService } from 'src/app/services/users.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

describe('UserPasswordComponent', () => {
  let component: UserPasswordComponent;
  let fixture: ComponentFixture<UserPasswordComponent>;
  let mockValidator: jasmine.SpyObj<ValidatorsService>;
  let mockUserService: jasmine.SpyObj<UsersService>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockMessage: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockValidator = jasmine.createSpyObj('ValidatorsService', [
      'validatePassword',
    ]);
    mockUserService = jasmine.createSpyObj('UsersService', ['modifyPassword']);

    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockMessage = jasmine.createSpyObj('MessageService', ['add']);

    mockStore.select.and.returnValue(of({ id: 285 }));
    await TestBed.configureTestingModule({
      declarations: [UserPasswordComponent],
      providers: [
        { provide: ValidatorsService, useValue: mockValidator },
        { provide: UsersService, useValue: mockUserService },
        { provide: Store, useValue: mockStore },
        { provide: MessageService, useValue: mockMessage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateStatus', () => {
    it('debe modifica el estado del botón a "Actualizando..."', () => {
      component.textButton = '';
      component.updating = false;

      component.updateStatus();

      expect(component.textButton).toBe('Actualizando...');
      expect(component.updating).toBe(true);
    });
  });

  describe('modify', () => {
    it('debe pasar al estado "actualizando"', () => {
      mockUserService.modifyPassword.and.returnValue(of());
      spyOn(component, 'updateStatus');
      component.modify();
      expect(component.updateStatus).toHaveBeenCalled();
    });

    it('debe volver al estado original si se cambia la contraseña', () => {
      mockUserService.modifyPassword.and.returnValue(of());
      spyOn(component, 'updateStatus');
      component.modify();
      expect(component.updateStatus).toHaveBeenCalled();
      expect(component.textButton).toBe('Actualizar');
      expect(component.updating).toBe(false);
    });

    it('debe volver al estado original si hay error', () => {
      mockUserService.modifyPassword.and.returnValue(
        throwError(() => new Error())
      );
      spyOn(component, 'updateStatus');
      component.modify();
      expect(component.updateStatus).toHaveBeenCalled();
      expect(component.textButton).toBe('Actualizar');
      expect(component.updating).toBe(false);
    });

    it('debe mostrar un mensaje de exito cuando el cambio de contraseña se produzca', () => {
      mockUserService.modifyPassword.and.returnValue(of(undefined));

      component.modify();

      expect(mockMessage.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'La contraseña se ha modificado con éxito',
        summary: 'Contraseña modificada',
      });
    });

    it('debe resetar los campos cuando la contraseña se cambie', () => {
      mockUserService.modifyPassword.and.returnValue(of(undefined));
      component.password = 'example';
      component.confirm = 'example_2';
      component.errors.password = 'example';
      component.errors.confirm = 'example_2';

      component.modify();

      expect(component.password).toBe('');
      expect(component.confirm).toBe('');
      expect(component.errors.password).toBe('');
      expect(component.errors.confirm).toBe('');
    });

    it('debe mostrar un mensaje de error cuando el cambio de contraseña no se produzca', () => {
      mockUserService.modifyPassword.and.returnValue(
        throwError(() => new Error())
      );

      component.modify();

      expect(mockMessage.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Ha ocurrido y la contraseña no se ha modificado',
        summary: 'Error',
      });
    });
  });

  describe('validate', () => {
    it('debe mostrar errores cuando la contraseña es errónea', () => {
      mockValidator.validatePassword.and.returnValue({
        isValid: false,
        message: 'Error clamoroso',
      });

      component.validate();

      expect(component.errors.password).toBe('Error clamoroso');
      expect(mockUserService.modifyPassword).not.toHaveBeenCalled();
    });

    it('debe mostrar errores cuando las contraseñas no coinciden', () => {
      mockValidator.validatePassword.and.returnValue({
        isValid: true,
        message: '',
      });
      component.password = 'a';
      component.confirm = 'b';
      component.validate();

      expect(component.errors.confirm).toBe('Las contraseñas no coinciden.');
      expect(mockUserService.modifyPassword).not.toHaveBeenCalled();
    });

    it('debe llamar a modify si no hay errores', () => {
      mockUserService.modifyPassword.and.returnValue(of(undefined));
      mockValidator.validatePassword.and.returnValue({
        isValid: true,
        message: '',
      });

      component.validate();

      expect(mockUserService.modifyPassword).toHaveBeenCalled();
    });
  });

  describe('Button disabled state', () => {
    it('debe desactivar el botón cuando updating es true', () => {
      component.updateStatus();
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBeTrue();
      expect(button.textContent).toBe('Actualizando...');
    });

    it('debe habilitar el botón cuando updating es false', () => {
      component.updating = false;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBeFalse();
      expect(button.textContent).toBe('Actualizar');
    });
  });
});

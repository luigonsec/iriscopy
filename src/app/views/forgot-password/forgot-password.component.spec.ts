import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    usersService = jasmine.createSpyObj('UsersService', ['forgotPassword']);
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);

    activatedRoute.queryParams = of({ email: 'email' });

    usersService.forgotPassword.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: MessageService, useValue: messageService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reset', () => {
    it('should reset the email when called', () => {
      component.reset();

      expect(component.email).toBe('');
    });

    it('should not call forgotPassword if the email is empty', () => {
      component.email = '';
      component.reset();
      expect(usersService.forgotPassword).not.toHaveBeenCalled();
    });

    it('should not call forgotPassword if the email is a empty space', () => {
      component.email = '   ';
      component.reset();
      expect(usersService.forgotPassword).not.toHaveBeenCalled();
    });

    it('should trim the when calling forgotPassword', () => {
      component.email = ' email ';
      component.reset();
      expect(usersService.forgotPassword).toHaveBeenCalledWith('email');
    });

    it('should add a success message', () => {
      component.email = 'email';
      component.reset();

      expect(messageService.add).toHaveBeenCalledWith({
        summary: 'Petición recibida',
        detail:
          'Se ha enviado un correo electrónico con los pasos para reestablecer la contraseña',
        severity: 'success',
      });
    });
  });
});

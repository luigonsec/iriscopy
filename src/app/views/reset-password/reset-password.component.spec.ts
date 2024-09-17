import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let mockActiveRouter: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    usersService = jasmine.createSpyObj('UsersService', ['forgotPassword']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
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
});

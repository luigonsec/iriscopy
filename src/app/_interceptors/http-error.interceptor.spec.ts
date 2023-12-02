import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  beforeEach(() => {
    return TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: jasmine.createSpyObj('AuthenticationService', ['logout']),
        },
        HttpErrorInterceptor,
      ],
    });
  });

  it('should be created', () => {
    interceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should call next handle', () => {
      const next = {
        handle: jasmine.createSpy().and.returnValue({
          pipe: jasmine.createSpy(),
        }),
      };
      const request = {};
      interceptor.intercept(request as any, next as any);
      expect(next.handle).toHaveBeenCalledWith(request);
    });
  });

  describe('manageError', () => {
    it('should not logout when err status is not 401', () => {
      const err = { status: 403, statusText: 'Error' };
      interceptor.manageError(err as any);
      expect(interceptor.authenticationService.logout).not.toHaveBeenCalled();
    });
    it('should logout when err status is 401', () => {
      const err = {
        status: 401,
        error: {
          message: 'Error',
        },
      };
      interceptor.manageError(err as any);
      expect(interceptor.authenticationService.logout).toHaveBeenCalled();
    });
  });
});

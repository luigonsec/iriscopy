import { TestBed } from '@angular/core/testing';
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
});

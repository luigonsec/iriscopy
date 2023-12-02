import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    })
  );

  it('should be created', () => {
    interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should set headers if access_token is defined', () => {
      const req = {
        clone: jasmine.createSpy(),
        headers: {
          set: jasmine.createSpy(),
        },
      };

      const next = {
        handle: jasmine.createSpy(),
      };
      spyOn(localStorage, 'getItem').and.returnValue('access_token');

      interceptor.intercept(req as any, next);

      expect(req.headers.set).toHaveBeenCalledWith(
        'Authorization',
        'Bearer access_token'
      );
    });

    it('should not set headers if access_token is not defined', () => {
      const req = {
        clone: jasmine.createSpy(),
        headers: {
          set: jasmine.createSpy(),
        },
      };

      const next = {
        handle: jasmine.createSpy(),
      };
      spyOn(localStorage, 'getItem').and.returnValue(undefined);

      interceptor.intercept(req as any, next);

      expect(req.headers.set).not.toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalledWith(req);
    });
  });
});

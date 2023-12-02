import { initializeApp } from './app.initializer';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

describe('InitializeApp', () => {
  let authService;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthenticationService', [
      'refreshToken',
    ]);
  });

  it('should call refreshToken() on the authentication service', (done) => {
    authService.refreshToken.and.callFake(() => {
      return Promise.resolve();
    });

    const initialize = initializeApp(authService);
    initialize().then(() => {
      expect(authService.refreshToken).toHaveBeenCalled();
      done();
    });
  });

  it('should resolve the promise', (done) => {
    authService.refreshToken.and.callFake(() => {
      return Promise.resolve();
    });

    const initialize = initializeApp(authService);
    initialize().then(() => {
      done();
    });
  });
});

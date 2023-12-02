import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth-guard.service';
import { AuthGuardChild } from './auth-guard.service';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authenticationService;
  let router;
  beforeEach(() => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', [
      'isLoggedIn',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthGuardChild },
        { provide: AuthService, useValue: authenticationService },
        { provide: Router, useValue: router },
      ],
    });
    authGuard = TestBed.inject(AuthGuard);
  });

  it('authGuard should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true is user is loggedIn', () => {
      authenticationService.isLoggedIn.and.returnValue(true);
      const result = authGuard.canActivate();
      expect(result).toBeTrue();
    });

    it('should return false is user is loggedIn and call navigate', () => {
      authenticationService.isLoggedIn.and.returnValue(false);
      const result = authGuard.canActivate();
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});

describe('AuthGuardChild', () => {
  let authGuardChild: AuthGuardChild;
  let authenticationService;
  let router;
  beforeEach(() => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', [
      'isLoggedIn',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authenticationService },
        { provide: Router, useValue: router },
      ],
    });
    authGuardChild = TestBed.inject(AuthGuardChild);
  });

  it('authGuard should be created', () => {
    expect(authGuardChild).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true is user is loggedIn', () => {
      authenticationService.isLoggedIn.and.returnValue(true);
      const result = authGuardChild.canActivateChild();
      expect(result).toBeTrue();
    });

    it('should return false is user is loggedIn and call navigate', () => {
      authenticationService.isLoggedIn.and.returnValue(false);
      const result = authGuardChild.canActivateChild();
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});

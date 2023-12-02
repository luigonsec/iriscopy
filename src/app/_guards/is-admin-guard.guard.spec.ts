import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { IsAdminGuardGuard } from './is-admin-guard.guard';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { SuperuserGuard } from './superuser.guard';
import IUser from '../_interfaces/IUser';

describe('IsAdminGuardGuard', () => {
  let guard: IsAdminGuardGuard;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let superuserGuardMock: jasmine.SpyObj<SuperuserGuard>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['getUser']);
    superuserGuardMock = jasmine.createSpyObj('SuperuserGuard', ['canActivate']);

    TestBed.configureTestingModule({
      providers: [
        IsAdminGuardGuard,
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: SuperuserGuard, useValue: superuserGuardMock },
      ],
    });

    guard = TestBed.inject(IsAdminGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    const mockNext: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    it('should return true if the user is an admin for a customer', () => {
      authServiceMock.getUser.and.returnValue({
        customers: [{ isAdmin: 1, name: 'Customer' }],
      } as IUser);

      const result = guard.canActivate(mockNext, mockState)

      expect(result).toBe(true)

    });

    it('should invoke SuperuserGuard canActivate method if user is not an admin for any customer', () => {
      authServiceMock.getUser.and.returnValue({
        customers: [{ isAdmin: 0, name: 'Customer' }],
      } as IUser);
      superuserGuardMock.canActivate.and.returnValue(true);

      const result = guard.canActivate(mockNext, mockState);

      expect(result).toBe(true)
      expect(superuserGuardMock.canActivate).toHaveBeenCalledWith(
        mockNext,
        mockState
      );
    });

    it('should handle scenario when no customers are returned', () => {
      authServiceMock.getUser.and.returnValue({ customers: [] } as IUser);
      superuserGuardMock.canActivate.and.returnValue(false);

      const result = guard.canActivate(mockNext, mockState)
      expect(result).toBe(false)

    });
  });
});
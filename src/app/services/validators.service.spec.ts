import { TestBed } from '@angular/core/testing';
import { ValidatorsService } from './validators.service';

describe('ValidatorsService', () => {
  let service: ValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorsService);
  });

  describe('validatePassword', () => {
    it('should return is not valid when password is too short', () => {
      const response = service.validatePassword('hola');
      expect(response.message).toBe(
        'La contraseña debe tener al menos 8 caracteres.'
      );
      expect(response.isValid).toBeFalse();
    });

    it('should return is not valid when password does not contain upper case character', () => {
      const response = service.validatePassword('holaaaaaaa');
      expect(response.message).toBe(
        'La contraseña debe tener al menos una letra mayúscula.'
      );
      expect(response.isValid).toBeFalse();
    });

    it('should return is not valid when password does not contain lower case character', () => {
      const response = service.validatePassword('HOLAAAAAAA');
      expect(response.message).toBe(
        'La contraseña debe tener al menos una letra minúscula.'
      );
      expect(response.isValid).toBeFalse();
    });

    it('should return is not valid when password does not contain a number', () => {
      const response = service.validatePassword('HOLAAAaaa');
      expect(response.message).toBe(
        'La contraseña debe tener al menos un número.'
      );
      expect(response.isValid).toBeFalse();
    });

    it('should return is not valid when password does not contain a special character', () => {
      const response = service.validatePassword('HOLAA3aaa');
      expect(response.message).toBe(
        'La contraseña debe tener al menos un carácter especial.'
      );
      expect(response.isValid).toBeFalse();
    });

    it('should return is valid when contains upper and lower case, number and special char', () => {
      const response = service.validatePassword('HOLAA3aaa!');
      expect(response.message).toBeUndefined();
      expect(response.isValid).toBeTrue();
    });
  });
});

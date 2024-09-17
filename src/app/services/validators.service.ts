import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  validatePassword(password) {
    // Validación de la contraseña
    const response = { isValid: true, message: undefined };

    if (!password || password.length < 8) {
      response.message = 'La contraseña debe tener al menos 8 caracteres.';
      response.isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      response.message =
        'La contraseña debe tener al menos una letra mayúscula.';
      response.isValid = false;
    } else if (!/[a-z]/.test(password)) {
      response.message =
        'La contraseña debe tener al menos una letra minúscula.';
      response.isValid = false;
    } else if (!/[0-9]/.test(password)) {
      response.message = 'La contraseña debe tener al menos un número.';
      response.isValid = false;
    } else if (!/[!@#$%^&*(),.?¿":{}|\+<>-]/.test(password)) {
      response.message =
        'La contraseña debe tener al menos un carácter especial.';
      response.isValid = false;
    }

    return response;
  }
}

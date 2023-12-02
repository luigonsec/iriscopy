import { AuthService } from '../services/auth.service';

export function initializeApp(authService: AuthService) {
  return (): Promise<unknown> => {
    return new Promise<void>((resolve, reject) => {
      // Do some asynchronous stuff
      authService.refreshToken();
      resolve();
    });
  };
}

import { AuthService } from './services/auth/auth.service';

export function initializeSession(authService: AuthService) {
  return (): Promise<any> => {
    if (authService.isAcceptingCookies) {
      return authService.initializeSession().toPromise();
    } else {
      return Promise.resolve();
    }
  };
}

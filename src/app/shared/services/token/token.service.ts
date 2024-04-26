import { jwtDecode } from 'jwt-decode';

import { Injectable } from '@angular/core';
import { IUser } from '@app/shared';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly JWT_TOKEN: string = 'token';

  constructor() {}

  getToken(): any {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  getLoggedUser(): IUser {
    const userToken = this.decodePayloadJWT();

    const { sub, person, personId, roles } = userToken;

    return {
      name: person,
      email: sub,
      personId,
      roles,
    };
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private decodePayloadJWT(): any {
    try {
      return jwtDecode(JSON.stringify(this.getToken() || '{}'));
    } catch (e) {
      return null;
    }
  }
}

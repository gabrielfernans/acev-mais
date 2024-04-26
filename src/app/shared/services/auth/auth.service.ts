import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, IAuthResponse } from '@app/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/authentication`;
  }

  login(email: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(this.endpoint, {
      email,
      password,
    });
  }
}

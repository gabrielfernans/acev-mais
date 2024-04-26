import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, IDashboard } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/dashboard`;
  }

  getMetrics(): Observable<IDashboard> {
    return this.http.get<IDashboard>(this.endpoint);
  }
}

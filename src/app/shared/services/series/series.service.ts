import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, ISeries, IServerResponse } from '@app/shared';

export interface ISeriesRequestParams {
  title: string;
  period?: string;
  author?: string;
}

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/series`;
  }

  getSeries(): Observable<ISeries[]> {
    return this.http.get<ISeries[]>(this.endpoint);
  }

  getSeriesById(id: string): Observable<ISeries> {
    return this.http.get<ISeries>(`${this.endpoint}/${id}`);
  }

  addSeries(params: ISeriesRequestParams): Observable<ISeries> {
    return this.http.post<ISeries>(this.endpoint, params);
  }

  updateSeries(id: string, params: ISeriesRequestParams): Observable<ISeries> {
    return this.http.put<ISeries>(`${this.endpoint}/${id}`, params);
  }

  addSeriesPhoto(id: string, photo: FormData): Observable<ISeries> {
    return this.http.post<ISeries>(`${this.endpoint}/${id}/photo`, photo);
  }

  deleteSeries(id: string): Observable<IServerResponse> {
    return this.http.delete<IServerResponse>(`${this.endpoint}/${id}`);
  }
}

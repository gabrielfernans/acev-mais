import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, IMinistry, IServerResponse, MemberRoleEnum } from '@app/shared';

export interface IMinistryRequestParams {
  name: string;
  description?: string;
  foundation?: string;
}

@Injectable({ providedIn: 'root' })
export class MinistryService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/ministries`;
  }

  getMinistries(): Observable<IMinistry[]> {
    return this.http.get<IMinistry[]>(this.endpoint);
  }

  getMinistryById(id: string): Observable<IMinistry> {
    return this.http.get<IMinistry>(`${this.endpoint}/${id}`);
  }

  addMinistry(params: IMinistryRequestParams): Observable<IMinistry> {
    return this.http.post<IMinistry>(this.endpoint, params);
  }

  updateMinistry(id: string, params: IMinistryRequestParams): Observable<IMinistry> {
    return this.http.put<IMinistry>(`${this.endpoint}/${id}`, params);
  }

  addMinistryPhoto(id: string, photo: FormData): Observable<IMinistry> {
    return this.http.post<IMinistry>(`${this.endpoint}/${id}/photo`, photo);
  }

  addMinistryPerson(id: string, idPerson: string, role: MemberRoleEnum): Observable<IMinistry> {
    const params = new HttpParams().set('personOffice', role);

    return this.http.post<IMinistry>(`${this.endpoint}/${id}/persons/${idPerson}`, null, {
      params,
    });
  }

  removeMinistryPerson(id: string, idPerson: string, role: MemberRoleEnum): Observable<IMinistry> {
    const params = new HttpParams().set('personOffice', role);

    return this.http.delete<IMinistry>(`${this.endpoint}/${id}/persons/${idPerson}`, { params });
  }

  archiveMinistry(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/archive`, {});
  }

  restoreMinistry(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/restore`, {});
  }
}

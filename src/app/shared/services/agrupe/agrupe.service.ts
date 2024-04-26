import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AgrupeCategoryEnum,
  EnvironmentService,
  WeekdayEnum,
  IAgrupe,
  IServerResponse,
  IAddress,
  MemberRoleEnum,
} from '@app/shared';

export interface IAgrupeRequestParams {
  name: string;
  category: AgrupeCategoryEnum;
  dayOfMeeting: WeekdayEnum;
  description?: string;
  address?: IAddress;
}

@Injectable({ providedIn: 'root' })
export class AgrupeService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/agrupes`;
  }

  getAgrupes(): Observable<IAgrupe[]> {
    return this.http.get<IAgrupe[]>(this.endpoint);
  }

  getAgrupeById(id: string): Observable<IAgrupe> {
    return this.http.get<IAgrupe>(`${this.endpoint}/${id}`);
  }

  addAgrupe(params: IAgrupeRequestParams): Observable<IAgrupe> {
    return this.http.post<IAgrupe>(this.endpoint, params);
  }

  updateAgrupe(id: string, params: IAgrupeRequestParams): Observable<IAgrupe> {
    return this.http.put<IAgrupe>(`${this.endpoint}/${id}`, params);
  }

  addAgrupePhoto(id: string, photo: FormData): Observable<IAgrupe> {
    return this.http.post<IAgrupe>(`${this.endpoint}/${id}/photo`, photo);
  }

  addAgrupePerson(id: string, idPerson: string, role: MemberRoleEnum): Observable<IAgrupe> {
    const params = new HttpParams().set('personOffice', role);

    return this.http.post<IAgrupe>(`${this.endpoint}/${id}/persons/${idPerson}`, null, { params });
  }

  removeAgrupePerson(id: string, idPerson: string, role: MemberRoleEnum): Observable<IAgrupe> {
    const params = new HttpParams().set('personOffice', role);

    return this.http.delete<IAgrupe>(`${this.endpoint}/${id}/persons/${idPerson}`, { params });
  }

  archiveAgrupe(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/archive`, {});
  }

  restoreAgrupe(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/restore`, {});
  }
}

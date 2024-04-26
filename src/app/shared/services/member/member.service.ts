import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EnvironmentService,
  GenderEnum,
  IAddress,
  IMember,
  IServerResponse,
  MaritalStatusEnum,
  MemberEntryCategoryEnum,
  MemberTypeEnum,
  PagedResponse,
} from '@app/shared';

export interface IMemberRequestParams {
  name: string;
  memberType: MemberTypeEnum;
  gender: GenderEnum;
  maritalStatus: MaritalStatusEnum;
  birthDate: string;
  email: string;
  phone: string;
  entryCategory: MemberEntryCategoryEnum;
  entryDate: string;
  address: IAddress;
}

export interface IMemberPaginationParams {
  direction: Sort;
  page: number;
  size: number;
}

export interface IMemberFilterParams {
  query: string;
  memberType?: MemberTypeEnum;
  entryCategory?: MemberEntryCategoryEnum;
  gender?: GenderEnum;
  maritalStatus?: MaritalStatusEnum;
  archived?: boolean;
}

export type Sort = 'ASC' | 'DESC';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/persons`;
  }

  getMembers(
    pagination: IMemberPaginationParams,
    filters: IMemberFilterParams,
  ): Observable<PagedResponse<IMember>> {
    let params = new HttpParams();

    for (const key in pagination) {
      if (pagination.hasOwnProperty(key)) {
        const value = pagination[key as keyof IMemberPaginationParams];
        params = params.set(key, value!);
      }
    }

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const value = filters[key as keyof IMemberFilterParams];
        params = params.set(key, value!);
      }
    }

    return this.http.get<PagedResponse<IMember>>(this.endpoint, { params });
  }

  getMemberById(id: string): Observable<IMember> {
    return this.http.get<IMember>(`${this.endpoint}/${id}`);
  }

  searchMembers(query: string): Observable<IMember[]> {
    const params = new HttpParams().set('query', query);

    return this.http.get<IMember[]>(`${this.endpoint}/search`, { params });
  }

  addMember(params: IMemberRequestParams): Observable<IMember> {
    return this.http.post<IMember>(this.endpoint, params);
  }

  updateMember(id: string, params: IMemberRequestParams): Observable<IMember> {
    return this.http.put<IMember>(`${this.endpoint}/${id}`, params);
  }

  addMemberPhoto(id: string, photo: FormData): Observable<IMember> {
    return this.http.post<IMember>(`${this.endpoint}/${id}/photo`, photo);
  }

  archiveMember(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/archive`, {});
  }

  restoreMember(id: string): Observable<IServerResponse> {
    return this.http.put<IServerResponse>(`${this.endpoint}/${id}/restore`, {});
  }
}

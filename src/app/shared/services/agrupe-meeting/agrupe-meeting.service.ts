import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, IAgrupeMeeting, IServerResponse, PagedResponse } from '@app/shared';

export interface IAgrupeMeetingRequestParams {
  idAgrupe: string;
  idLesson: string;
  date: string;
  idParticipants: string[];
  customLesson: boolean;
  customLessonTitle?: string;
  guests?: string[];
}

export interface IAgrupeMeetingPaginationParams {
  page: number;
  size: number;
}

export interface IAgrupeMeetingFilterParams {
  idAgrupe?: string;
  idLesson?: string;
}

@Injectable({ providedIn: 'root' })
export class AgrupeMeetingService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/agrupe-meetings`;
  }

  getAgrupeMeetings(
    pagination: IAgrupeMeetingPaginationParams,
    filters: IAgrupeMeetingFilterParams,
  ): Observable<PagedResponse<IAgrupeMeeting>> {
    let params = new HttpParams();

    for (const key in pagination) {
      if (pagination.hasOwnProperty(key)) {
        const value = pagination[key as keyof IAgrupeMeetingPaginationParams];
        params = params.set(key, value!);
      }
    }

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const value = filters[key as keyof IAgrupeMeetingFilterParams];
        params = params.set(key, value!);
      }
    }

    return this.http.get<PagedResponse<IAgrupeMeeting>>(this.endpoint, { params });
  }

  getAgrupeMeetingById(id: string): Observable<IAgrupeMeeting> {
    return this.http.get<IAgrupeMeeting>(`${this.endpoint}/${id}`);
  }

  addAgrupeMeeting(params: IAgrupeMeetingRequestParams): Observable<IAgrupeMeeting> {
    return this.http.post<IAgrupeMeeting>(this.endpoint, params);
  }

  updateAgrupeMeeting(id: string, params: IAgrupeMeetingRequestParams): Observable<IAgrupeMeeting> {
    return this.http.put<IAgrupeMeeting>(`${this.endpoint}/${id}`, params);
  }

  addAgrupeMeetingPhoto(id: string, photo: FormData): Observable<IAgrupeMeeting> {
    return this.http.post<IAgrupeMeeting>(`${this.endpoint}/${id}/photo`, photo);
  }

  removeAgrupeMeeting(id: string): Observable<IServerResponse> {
    return this.http.delete<IServerResponse>(`${this.endpoint}/${id}`);
  }
}

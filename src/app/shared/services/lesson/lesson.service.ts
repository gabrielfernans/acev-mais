import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService, ILesson, IServerResponse } from '@app/shared';

export interface ILessonRequestParams {
  idSeries: string;
  title: string;
  origin?: string;
  adaptation?: string;
  revision?: string;
  greeting?: string;
  musicSuggestions?: string[];
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {
    this.endpoint = `${this.environment.apiUrl}/lessons`;
  }

  getLesson(): Observable<ILesson[]> {
    return this.http.get<ILesson[]>(this.endpoint);
  }

  getLessonById(id: string): Observable<ILesson> {
    return this.http.get<ILesson>(`${this.endpoint}/${id}`);
  }

  addLesson(params: ILessonRequestParams): Observable<ILesson> {
    return this.http.post<ILesson>(this.endpoint, params);
  }

  updateLesson(id: string, params: ILessonRequestParams): Observable<ILesson> {
    return this.http.put<ILesson>(`${this.endpoint}/${id}`, params);
  }

  addLessonFile(id: string, file: FormData): Observable<ILesson> {
    return this.http.post<ILesson>(`${this.endpoint}/${id}/file`, file);
  }

  deleteLesson(id: string): Observable<IServerResponse> {
    return this.http.delete<IServerResponse>(`${this.endpoint}/${id}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_AUTH_HEADER } from '@app/core';
import { EnvironmentService, IAddressViaCep, IGeocodeAddress } from '@app/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
  ) {}

  getViaCepAddress(postalCode: string): Observable<IAddressViaCep> {
    return this.http.get<IAddressViaCep>(`${this.environment.viaCepUrl}/ws/${postalCode}/json`);
  }

  getGeocodeCoordinates(address: string): Observable<IGeocodeAddress> {
    const params = {
      address: address,
      key: this.environment.googleMapsGeocodeKey,
    };

    const headers = new HttpHeaders().set(SKIP_AUTH_HEADER, 'true');

    return this.http.get<any>(this.environment.googleMapsGeocodeUrl, { params, headers });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  production: boolean = environment.production;
  apiUrl: string = environment.apiUrl;
  viaCepUrl: string = environment.viaCepUrl;
  googleMapsGeocodeUrl: string = environment.googleMapsGeocodeUrl;
  googleMapsGeocodeKey: string = environment.googleMapsGeocodeKey;
}

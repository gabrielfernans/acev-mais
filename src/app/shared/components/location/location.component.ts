import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { IGeocodeAddress } from '@app/shared/models';

@Component({
  selector: 'app-custom-location',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @Input() coordinates!: IGeocodeAddress;

  mapOptions!: google.maps.MapOptions;
  markerPosition!: google.maps.LatLngLiteral;

  constructor() {}

  ngOnInit(): void {
    const { lat, lng } = this.coordinates.results?.[0].geometry.location;

    this.mapOptions = {
      center: { lat, lng },
      zoom: 14,
    };

    this.markerPosition = {
      lat,
      lng,
    };
  }
}

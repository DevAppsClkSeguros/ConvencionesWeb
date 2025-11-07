import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  NgZone,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa-selector',
  imports: [CommonModule, GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mapa-selector.component.html',
  styleUrls: ['./mapa-selector.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MapaSelectorComponent {
  coordenadas = output<any>();
  coordenadasDefault = input<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  lat = computed(() => {
    return this.coordenadasDefault()?.lat;
  });
  lng = computed(() => {
    return this.coordenadasDefault()?.lng;
  });
  markerPosition = signal<{ lat: number; lng: number } | null>(null);
  zoom = signal(15);

  mapOptions: google.maps.MapOptions = {
    mapId: 'ConvencionesID',
    zoom: 15,
  };

  @ViewChild('placeAutocomplete', { static: false })
  placeAutocompleteRef!: ElementRef<HTMLElement>;

  constructor(private ngZone: NgZone) {
    afterNextRender(() => {
      this.initPlaceAutocomplete();
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition.set({ lat, lng });
      this.coordenadas.emit({ lat, lng });
    }
  }

  private async initPlaceAutocomplete() {
    if (!this.placeAutocompleteRef) {
      return;
    }

    const autocompleteElement = this.placeAutocompleteRef.nativeElement as any;

    await customElements.whenDefined('gmp-place-autocomplete');

    autocompleteElement.addEventListener('gmp-select', async (event: any) => {
      this.ngZone.run(async () => {
        const placePrediction = event.placePrediction;
        const place = placePrediction.toPlace();
        await place.fetchFields({
          fields: ['location', 'displayName', 'formattedAddress'],
        });

        if (place.location) {
          const lat = place.location.lat();
          const lng = place.location.lng();

          console.log('✅ Nueva ubicación:', { lat, lng });

          this.markerPosition.set({ lat, lng });
          this.zoom.set(16);
        } else {
          console.error('❌ No se pudo obtener location');
        }
      });
    });
  }
}

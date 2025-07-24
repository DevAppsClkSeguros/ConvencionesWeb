import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MicrosoftGraphService } from '../../services/microsoftGraph.service';
import { ScrollStateService } from '../../services/scroll-state.service';
import { ImagenListComponent } from '../imagen-list/imagen-list.component';
import { ActivatedRoute } from '@angular/router';
import type { Imagen } from '../../interfaces/imagen.interface';
import { ImageMapper } from '../../mapper/memorias-fotograficas.mapper';
import { AppConfig } from '@shared/app-config';

@Component({
  selector: 'app-memorias-fotograficas',
  imports: [ImagenListComponent],
  templateUrl: './memorias-fotograficas.component.html',
})
export class MemoriasFotograficasComponent implements OnInit, AfterViewInit {
  microsoftGraphService = inject(MicrosoftGraphService);
  scrollStateService = inject(ScrollStateService);
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');
  private route = inject(ActivatedRoute);
  carpetaId = this.route.snapshot.params['convencion'];

  private nextLink: string | null = null;
  trendingImagenLoading = signal(false);
  trendingImagen = signal<Imagen[]>([]);
  private usedNextLinks = new Set<string>();
  existeError = signal(false);
  trendingImagenGroup = computed<Imagen[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingImagen().length; i += 3) {
      groups.push(this.trendingImagen().slice(i, i + 3));
    }
    return groups;
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const nombreConvencion = params['convencion'];
      this.nextLink = null;
      this.trendingImagen.set([]);
      this.usedNextLinks.clear();
      this.verificaMultimedia(nombreConvencion);
    });
  }

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  verificaMultimedia(nombreConvencion: string) {
    this.microsoftGraphService.archivosUnidadOneDriveMS().subscribe({
      next: (dataUnidad) => {
        if (dataUnidad) {
          let eventoPath = dataUnidad.value.filter(
            (v) => v.name === nombreConvencion
          )[0];
          this.existeError.set(!eventoPath);
          if (eventoPath) {
            this.microsoftGraphService
              .archivosCarpetaOneDriveMS(eventoPath?.id)
              .subscribe({
                next: (dataCarpeta) => {
                  this.existeError.set(!dataCarpeta);
                  if (dataCarpeta) {
                    let imagenesPath = dataCarpeta.value.filter(
                      (v) => v.name === 'imagenes'
                    )[0];
                    this.cargaMultimedia(imagenesPath?.id);
                  }
                },
                error: (error) => {
                  this.existeError.set(true);
                }
              });
          }
        }
      },
      error: (error) => {
        this.existeError.set(true);
      }
    });
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);
    if (isAtBottom) {
      // this.microsoftGraphService.loadTrendingGifs();
      this.cargaMultimedia();
    }
  }

  cargaMultimedia(carpetaId?: string) {
    if (this.trendingImagenLoading()) return;
    this.trendingImagenLoading.set(true);
    const url = this.nextLink
      ? this.nextLink
      : `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/${carpetaId}/children?$top=25&$expand=thumbnails&$orderby=lastModifiedDateTime desc`;
    if (this.usedNextLinks.has(url)) {
      this.trendingImagenLoading.set(false);
      return;
    }
    this.usedNextLinks.add(url);
    this.microsoftGraphService.archivosCarpetaScroll(url).subscribe({
      next: (resp) => {
        const imagenes = ImageMapper.mapMicrosoftItemToImageArray(resp.value);
        this.trendingImagen.update((currentGifs) => [
          ...currentGifs,
          ...imagenes,
        ]);
        this.nextLink = resp['@odata.nextLink'] || null;
        this.trendingImagenLoading.set(false);
      },
      error: (error) => {
        this.existeError.set(true);
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MicrosoftGraphService } from '../../services/microsoftGraph.service';
import { ScrollStateService } from '../../services/scroll-state.service';
import { ImagenListComponent } from "../imagen-list/imagen-list.component";


@Component({
  selector: 'app-memorias-fotograficas',
  imports: [ImagenListComponent],
  templateUrl: './memorias-fotograficas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoriasFotograficasComponent {
  microsoftGraphService = inject(MicrosoftGraphService);

}

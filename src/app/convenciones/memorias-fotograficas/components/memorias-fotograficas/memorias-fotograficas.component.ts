import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MicrosoftGraphService } from '../../services/microsoftGraph.service';
import { ScrollStateService } from '../../services/scroll-state.service';
import { ImagenListComponent } from "../imagen-list/imagen-list.component";


@Component({
  selector: 'app-memorias-fotograficas',
  imports: [ImagenListComponent],
  templateUrl: './memorias-fotograficas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoriasFotograficasComponent implements AfterViewInit {
  microsoftGraphService = inject(MicrosoftGraphService);

  scrollStateService = inject(ScrollStateService);
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
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
      this.microsoftGraphService.loadTrendingGifs();
    }
  }
}

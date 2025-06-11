import { Component, Input } from '@angular/core';
import type { Card } from '../../interfaces/card.interface';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [NgClass, RouterLink],
  templateUrl: './card.component.html',
})
export class CardComponent {
  // card = input<Card>()
  @Input() card!: Card;
}
